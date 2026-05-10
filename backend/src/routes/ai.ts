import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// ── System Prompt ──────────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `
Bạn là TravelEasy AI, một trợ lý du lịch thông minh, tận tâm và vô cùng chuyên nghiệp của nền tảng TravelEasy.
Nhiệm vụ của bạn:
1. Luôn thấu hiểu ý định của người dùng, phân tích câu hỏi dù họ viết sai chính tả, viết tắt hay hỏi mơ hồ.
2. Hỗ trợ khách hàng đặt tour, vé máy bay, khách sạn trên hệ thống TravelEasy.
3. Giải đáp các thắc mắc về du lịch, kinh nghiệm hành trình, thời tiết, văn hóa, địa điểm du lịch (trong và ngoài nước).
4. Có khả năng nói chuyện phiếm (small talk) một cách hóm hỉnh, lịch sự để tạo sự gần gũi.
5. Trả lời được các câu hỏi đơn giản hàng ngày (mấy giờ rồi, hôm nay ngày mấy, thời tiết, v.v.)
6. Gợi ý các địa điểm du lịch chi tiết và hấp dẫn. Trình bày thông tin một cách lôi cuốn.
7. Luôn ưu tiên dẫn dắt khách hàng sử dụng các dịch vụ của TravelEasy.
8. BẮT BUỘC: Khi gợi ý một Tour hoặc Khách sạn cụ thể từ dữ liệu tham khảo, bạn PHẢI tạo link trực tiếp vào tên của nó dựa trên ID được cung cấp.
   - Cú pháp: "[Tên Tour/Khách sạn](/tours/ID)" hoặc "[Tên Khách sạn](/hotels/ID)".
   - Ví dụ: Nếu dữ liệu là "Tour (ID: 15): Khám Phá Sapa", hãy viết: "[Tour Khám Phá Sapa](/tours/15)".
   - Nếu khách chỉ hỏi chung chung, có thể dùng link danh sách: [Tour du lịch](/tours), [Khách sạn](/hotels), [Vé máy bay](/flights), [Ưu đãi](/vouchers).
   - Danh sách link:
     * Tour: [Tour du lịch](/tours)
     * Khách sạn: [Khách sạn](/hotels)
     * Vé máy bay: [Vé máy bay](/flights)
     * Voucher/Ưu đãi: [Ưu đãi](/vouchers)
     * Blog: [Blog du lịch](/blogs)
9. Trả lời bằng tiếng Việt chuẩn xác. Tích cực sử dụng Markdown (như **in đậm**, emoji, list) để câu trả lời sinh động, dễ đọc. TUYỆT ĐỐI KHÔNG dùng ký tự '#' để làm tiêu đề, hãy dùng số (1., 2.). KHÔNG dùng '*' ở đầu dòng, hãy dùng '-'.
10. Nếu khách hàng hỏi những điều nằm ngoài khả năng, hãy khéo léo điều hướng họ liên hệ nhân viên hoặc quay lại chủ đề du lịch, không bao giờ nói "Tôi không biết".
11. Phân tích ngữ cảnh từ các tin nhắn trước để trả lời một cách tự nhiên như một cuộc trò chuyện thực tế.
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

// ── Smart Local Fallback ──────────────────────────────────────────────────────
interface Rule {
  keywords: string[];
  regex?: RegExp;
  answer: string | (() => string);
}

const localRules: Rule[] = [
  // ── Greetings ──
  {
    keywords: ['xin chào', 'hello', 'hi', 'chào bạn', 'chào', 'hey', 'alo', 'helu', 'ê'],
    regex: /^(hi|hello|chao|xin chao|hey|alo)\b/i,
    answer: 'Xin chào bạn! 👋 Mình là **TravelEasy AI** — trợ lý du lịch thông minh.\n\nMình có thể giúp bạn:\n- 🗺️ Gợi ý **địa điểm du lịch**\n- ✈️ Đặt **vé máy bay**\n- 🏨 Tìm **khách sạn**\n- 🎟️ Tra **ưu đãi & voucher**\n\nBạn muốn đi đâu hôm nay? 😊',
  },

  // ── Time ──
  {
    keywords: ['mấy giờ', 'giờ rồi', 'bây giờ là mấy giờ', 'thời gian', 'may gio', 'gio roi'],
    regex: /m[aâ]y gi[oờ]/i,
    answer: () => {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
      const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
      return `🕐 Bây giờ là **${time}**, ${date} (giờ Việt Nam).\n\nBạn đang lên kế hoạch cho chuyến đi nào không? Mình có thể giúp bạn tìm tour hoặc đặt vé nhé! 😊`;
    },
  },

  // ── Date ──
  {
    keywords: ['hôm nay ngày mấy', 'ngày mấy', 'ngày bao nhiêu', 'thứ mấy', 'hom nay ngay may', 'ngay may'],
    regex: /ng[aà]y m[aâ]y|th[uứ] m[aâ]y/i,
    answer: () => {
      const now = new Date();
      const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
      return `📅 Hôm nay là **${date}**.\n\nCuối tuần này bạn có kế hoạch đi chơi ở đâu không? Mình gợi ý cho bạn vài điểm đến hấp dẫn nhé! 🌟`;
    },
  },

  // ── International Destinations ──
  {
    keywords: ['bangkok', 'thái lan', 'thai lan'],
    regex: /th[aá]i lan|bangkok/i,
    answer: '🇹🇭 **Bangkok (Thái Lan)** — Thiên đường mua sắm và ẩm thực!\n\n📍 **Điểm đến nổi bật:**\n- 🕌 Hoàng cung (Grand Palace)\n- 🛕 Chùa Phật Ngọc, Chùa Bình Minh (Wat Arun)\n- 🛍️ Chợ Chatuchak, Siam Paragon\n- 🛥️ Dạo sông Chao Phraya\n\n🍜 **Ẩm thực:** Tom Yum, Pad Thai, xôi xoài\n\n💡 **Mẹo:** Nên đi vào tháng 11 - tháng 2 khi thời tiết mát mẻ.\n\n👉 Xem tour Thái Lan tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['singapore', 'sing'],
    regex: /singapore|sing/i,
    answer: '🇸🇬 **Singapore** — Quốc đảo sư tử sạch đẹp nhất thế giới!\n\n📍 **Điểm đến nổi bật:**\n- 🌳 Gardens by the Bay\n- 🦁 Công viên Merlion\n- 🎡 Đảo Sentosa & Universal Studios\n- 🛍️ Đại lộ Orchard\n\n🦀 **Ẩm thực:** Cua sốt ớt (Chili Crab), cơm gà Hải Nam\n\n👉 Khám phá Singapore tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['tokyo', 'nhật bản', 'nhat ban', 'nhật'],
    regex: /nh[aậ]t|tokyo/i,
    answer: '🇯🇵 **Tokyo (Nhật Bản)** — Sự giao thoa giữa truyền thống và hiện đại!\n\n📍 **Điểm đến nổi bật:**\n- 🗼 Tháp Tokyo, Shibuya Crossing\n- 🛕 Đền Senso-ji\n- 🏰 Cung điện Hoàng gia\n- 🗻 Núi Phú Sĩ (cách 2h đi xe)\n\n🍣 **Ẩm thực:** Sushi, Ramen, Tempura\n\n👉 Đặt tour Nhật Bản tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['seoul', 'hàn quốc', 'han quoc', 'hàn'],
    regex: /h[aà]n|seoul/i,
    answer: '🇰🇷 **Seoul (Hàn Quốc)** — Xứ sở Kim Chi đầy quyến rũ!\n\n📍 **Điểm đến nổi bật:**\n- 🏰 Cung điện Gyeongbokgung\n- 🗼 N Seoul Tower\n- 🛍️ Myeongdong, Gangnam\n- 🎢 Lotte World\n\n🍗 **Ẩm thực:** Kim chi, Kimbap, thịt nướng BBQ\n\n👉 Xem tour Hàn Quốc tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['bali', 'indonesia'],
    regex: /bali|indo/i,
    answer: '🏝️ **Bali (Indonesia)** — Thiên đường nghỉ dưỡng nhiệt đới!\n\n📍 **Điểm đến nổi bật:**\n- 🌊 Ruộng bậc thang Ubud\n- 🛕 Đền Uluwatu, Đền Tanah Lot\n- 🏖️ Bãi biển Kuta, Seminyak\n\n🍹 **Ẩm thực:** Nasi Goreng, Satay\n\n👉 Xem tour Bali tại [Tour du lịch](/tours)!',
  },

  // ── Vietnam Destinations ──
  {
    keywords: ['đà nẵng', 'da nang'],
    regex: /đ[aà] n[aẵ]ng/i,
    answer: '🏖️ **Đà Nẵng** — Thành phố đáng sống nhất Việt Nam!\n\n📍 **Điểm đến nổi bật:**\n- 🌉 Cầu Rồng, cầu Vàng (Bà Nà Hills)\n- 🏖️ Biển Mỹ Khê\n- ⛰️ Ngũ Hành Sơn, Bán đảo Sơn Trà\n\n🍜 **Ẩm thực:** Mì Quảng, bánh tráng cuốn thịt heo\n\n👉 Xem tour Đà Nẵng tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['hà nội', 'ha noi'],
    regex: /h[aà] n[oộ]i/i,
    answer: '🏯 **Hà Nội** — Thủ đô nghìn năm văn hiến!\n\n📍 **Điểm đến nổi bật:**\n- 🏛️ Phố cổ 36 phố phường\n- 🌊 Hồ Gươm, Lăng Bác\n- 🏯 Văn Miếu Quốc Tử Giám\n\n🍜 **Ẩm thực:** Phở, bún chả, cà phê trứng\n\n👉 Xem tour Hà Nội tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['phú quốc', 'phu quoc'],
    regex: /ph[uú] qu[oố]c/i,
    answer: '🏝️ **Phú Quốc** — Đảo Ngọc xanh mướt!\n\n📍 **Điểm đến nổi bật:**\n- 🏖️ Bãi Sao, Bãi Dài\n- 🎡 VinWonders, Safari\n- 🚠 Cáp treo Hòn Thơm\n\n👉 Xem tour Phú Quốc tại [Tour du lịch](/tours)!',
  },
  {
      keywords: ['đia điểm du lịch', 'gợi ý', 'đi đâu', 'dia diem du lich', 'di dau'],
      regex: /g[oợ]i [yý]|đ[i] đ[aâ]u|ch[oơ]i g[iì]/i,
      answer: '🌟 **Gợi ý địa điểm du lịch hấp dẫn:**\n\n🇻🇳 **Trong nước:** Hà Nội, Đà Nẵng, Phú Quốc, Sa Pa, Đà Lạt, Nha Trang...\n🌏 **Quốc tế:** Thái Lan (Bangkok), Singapore, Nhật Bản (Tokyo), Hàn Quốc (Seoul), Bali...\n\n👉 Xem tất cả tại [Tour du lịch](/tours)!',
  },

  // ── Services ──
  {
    keywords: ['vé máy bay', 've may bay', 'bay', 'đặt vé', 'mua vé'],
    regex: /v[eé] m[aá]y bay|đ[aặ]t v[eé]|mua v[eé]|bay/i,
    answer: '✈️ **Đặt vé máy bay tại TravelEasy:**\n- Nhiều hãng bay: Vietnam Airlines, Vietjet, Bamboo...\n- Giá cạnh tranh, đặt chỗ nhanh chóng.\n\n👉 Tìm vé tại [Đặt vé máy bay](/flights)!',
  },
  {
    keywords: ['khách sạn', 'khach san', 'phòng', 'phong', 'đặt phòng'],
    regex: /kh[aá]ch s[aạ]n|đ[aặ]t ph[oò]ng|resort/i,
    answer: '🏨 **Tìm phòng khách sạn:**\n- Hơn 1.000 khách sạn liên kết trên toàn quốc.\n- Giá ưu đãi, cam kết chất lượng.\n\n👉 Xem tại [Khách sạn](/hotels)!',
  },
  {
    keywords: ['tour', 'du lịch', 'du lich', 'đặt tour', 'chuyến đi'],
    regex: /tour|du l[iị]ch/i,
    answer: '🗺️ **Tour du lịch hấp dẫn:**\n- Lịch trình phong phú, hướng dẫn viên chuyên nghiệp.\n- Tour trong nước & quốc tế giá tốt.\n\n👉 Xem tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['voucher', 'mã giảm giá', 'ưu đãi', 'khuyến mãi', 'discount'],
    regex: /voucher|m[aã] gi[aả]m gi[aá]|[uư]u đ[aã]i|khuy[eế]n m[aã]i/i,
    answer: '🎟️ **Ưu đãi & Voucher TravelEasy:**\n- Thường xuyên có các mã giảm giá cho đơn đầu tiên, mùa hè, lễ tết.\n- Giảm trực tiếp vào giá vé, tour, khách sạn.\n\n👉 Lấy mã ngay tại [Ưu đãi](/vouchers)!',
  },

  // ── Thanks ──
  {
    keywords: ['cảm ơn', 'cam on', 'thank', 'thanks', 'tuyệt', 'ok', 'tuyệt vời'],
    regex: /c[aả]m [oơ]n|thank|tuy[eệ]t|ok/i,
    answer: '😊 Rất vui khi được giúp bạn! Nếu cần thêm thông tin gì, đừng ngần ngại hỏi mình nhé. Chúc bạn một ngày tốt lành!',
  },
];

function getLocalResponse(text: string): string {
  const lower = text.toLowerCase().trim();
  const normalizedLower = removeDiacritics(lower);
  
  for (const rule of localRules) {
    if (rule.regex && rule.regex.test(lower)) {
      return typeof rule.answer === 'function' ? rule.answer() : rule.answer;
    }

    const isMatched = rule.keywords.some(kw => {
        const lowerKw = kw.toLowerCase();
        const normalizedKw = removeDiacritics(lowerKw);
        return lower.includes(lowerKw) || normalizedLower.includes(normalizedKw);
    });

    if (isMatched) {
      return typeof rule.answer === 'function' ? rule.answer() : rule.answer;
    }
  }

  return '🤖 Xin lỗi, mình chưa hiểu rõ ý bạn. Bạn có thể hỏi về:\n- 🗺️ Địa điểm du lịch (Hà Nội, Bangkok...)\n- ✈️ Vé máy bay, khách sạn, tour\n- 🎟️ Mã giảm giá, voucher\n\nHoặc liên hệ nhân viên ở tab **"Nhân viên"** nhé! 😊';
}

// ── Route Handler ──────────────────────────────────────────────────────────────
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    // If no API key, use smart local fallback
    if (!apiKey) {
      const answer = getLocalResponse(message || '');
      res.json({ answer });
      return;
    }

    // ── Build Dynamic Context from DB ──
    let dbContext = '';
    const lowerMsg = (message || '').toLowerCase();
    
    // Extract budget
    let maxBudget: number | null = null;
    const budgetMatch = lowerMsg.match(/(\d+)\s*(triệu|tr|củ|nghìn|k)/);
    if (budgetMatch) {
      const num = parseInt(budgetMatch[1]);
      const unit = budgetMatch[2];
      if (unit === 'triệu' || unit === 'tr' || unit === 'củ') maxBudget = num * 1000000;
      else if (unit === 'nghìn' || unit === 'k') maxBudget = num * 1000;
    } else {
      const explicitNumMatch = lowerMsg.match(/(\d{6,8})/); // 1,000,000 to 99,000,000
      if (explicitNumMatch) maxBudget = parseInt(explicitNumMatch[1]);
    }

    const OR: any[] = [];
    const locations = ['phú quốc', 'đà nẵng', 'nha trang', 'đà lạt', 'hà nội', 'sapa', 'sa pa', 'hồ chí minh', 'hcm', 'thái lan', 'bangkok', 'singapore', 'nhật bản', 'hàn quốc', 'bali'];
    for (const loc of locations) {
      if (lowerMsg.includes(loc)) {
        OR.push({ location: { contains: loc, mode: 'insensitive' } });
        OR.push({ name: { contains: loc, mode: 'insensitive' } });
      }
    }

    const whereClause: any = {};
    if (OR.length > 0) whereClause.OR = OR;
    if (maxBudget) whereClause.price = { lte: maxBudget };

    // We only query if there's a budget or a specific location asked.
    if (OR.length > 0 || maxBudget) {
      const matchingTours = await prisma.tour.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        take: 3,
        orderBy: { rating: 'desc' }
      });

      if (matchingTours.length > 0) {
        dbContext += '\n\nDỮ LIỆU TOUR THAM KHẢO TRONG HỆ THỐNG (ưu tiên giới thiệu các tour này nếu phù hợp):\n';
        matchingTours.forEach(t => {
          dbContext += `- Tour (ID: ${t.id}): ${t.name} | Giá: ${t.price?.toLocaleString('vi-VN')} VNĐ | Đánh giá: ${t.rating} sao\n`;
        });
      }

      if (lowerMsg.includes('khách sạn') || lowerMsg.includes('phòng') || lowerMsg.includes('resort') || lowerMsg.includes('ở đâu')) {
        const matchingHotels = await prisma.hotel.findMany({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
          take: 3,
          orderBy: { rating: 'desc' }
        });
        if (matchingHotels.length > 0) {
          dbContext += '\n\nDỮ LIỆU KHÁCH SẠN THAM KHẢO TRONG HỆ THỐNG:\n';
          matchingHotels.forEach(h => {
            dbContext += `- Khách sạn (ID: ${h.id}): ${h.name} | Giá: ${h.price?.toLocaleString('vi-VN')} VNĐ/đêm | Đánh giá: ${h.rating} sao\n`;
          });
        }
      }
    }

    const finalSystemInstruction = SYSTEM_INSTRUCTION + dbContext;

    // ── Gemini API call ──
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: finalSystemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const answer = getLocalResponse(message || '');
      res.json({ answer });
      return;
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalResponse(message || '');

    res.json({ answer });
  } catch (err) {
    console.error('[AI CHAT ERROR]', err);
    try {
      const answer = getLocalResponse(req.body?.message || '');
      res.json({ answer });
    } catch {
      res.status(500).json({ error: 'AI Chat failed' });
    }
  }
});

export default router;
