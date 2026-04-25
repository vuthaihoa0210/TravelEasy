import { Router, Request, Response } from 'express';

const router = Router();

// ── System Prompt ──────────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `
Bạn là TravelEasy AI, một trợ lý du lịch thông minh, thân thiện và chuyên nghiệp của nền tảng TravelEasy.
Nhiệm vụ của bạn:
1. Hỗ trợ khách hàng đặt tour, vé máy bay, khách sạn trên hệ thống TravelEasy.
2. Giải đáp các thắc mắc về du lịch, kinh nghiệm hành trình, thời tiết, văn hóa, địa điểm du lịch (trong và ngoài nước).
3. Có khả năng nói chuyện phiếm (small talk) một cách hóm hỉnh, lịch sự để tạo sự gần gũi.
4. Trả lời được các câu hỏi đơn giản hàng ngày (mấy giờ rồi, hôm nay ngày mấy, thời tiết, v.v.)
5. Gợi ý các địa điểm du lịch nổi tiếng khi được hỏi, cung cấp thông tin hữu ích về mỗi nơi.
6. Luôn ưu tiên dẫn dắt khách hàng sử dụng các dịch vụ của TravelEasy.
7. Nếu khách hàng hỏi về các dịch vụ cụ thể, hãy trả về link dưới dạng Markdown để họ dễ bấm vào:
   - Tour: [tour du lịch](/tours)
   - Khách sạn: [khách sạn](/hotels)
   - Vé máy bay: [vé máy bay](/flights)
   - Voucher: [ưu đãi](/vouchers)
   - Blog: [blog du lịch](/blogs)
8. Trả lời bằng tiếng Việt, sử dụng Markdown nếu cần thiết để trình bày đẹp mắt (dùng **bold**, emoji, gạch đầu dòng).
9. Giữ câu trả lời ngắn gọn, dễ đọc, không quá dài (dưới 200 từ).
10. Không bao giờ nói "Tôi không biết" mà hãy cố gắng đưa ra gợi ý hoặc hướng dẫn.
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
  answer: string | (() => string);
}

const localRules: Rule[] = [
  // ── Greetings ──
  {
    keywords: ['xin chào', 'hello', 'hi', 'chào bạn', 'chào', 'hey', 'alo', 'helu'],
    answer: 'Xin chào bạn! 👋 Mình là **TravelEasy AI** — trợ lý du lịch thông minh.\n\nMình có thể giúp bạn:\n- 🗺️ Gợi ý **địa điểm du lịch**\n- ✈️ Đặt **vé máy bay**\n- 🏨 Tìm **khách sạn**\n- 🎟️ Tra **ưu đãi & voucher**\n\nBạn muốn đi đâu hôm nay? 😊',
  },

  // ── Time ──
  {
    keywords: ['mấy giờ', 'giờ rồi', 'bây giờ là mấy giờ', 'thời gian', 'may gio', 'gio roi'],
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
    answer: () => {
      const now = new Date();
      const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
      return `📅 Hôm nay là **${date}**.\n\nCuối tuần này bạn có kế hoạch đi chơi ở đâu không? Mình gợi ý cho bạn vài điểm đến hấp dẫn nhé! 🌟`;
    },
  },

  // ── International Destinations ──
  {
    keywords: ['bangkok', 'thái lan', 'thai lan'],
    answer: '🇹🇭 **Bangkok (Thái Lan)** — Thiên đường mua sắm và ẩm thực!\n\n📍 **Điểm đến nổi bật:**\n- 🕌 Hoàng cung (Grand Palace)\n- 🛕 Chùa Phật Ngọc, Chùa Bình Minh (Wat Arun)\n- 🛍️ Chợ Chatuchak, Siam Paragon\n- 🛥️ Dạo sông Chao Phraya\n\n🍜 **Ẩm thực:** Tom Yum, Pad Thai, xôi xoài\n\n💡 **Mẹo:** Nên đi vào tháng 11 - tháng 2 khi thời tiết mát mẻ.\n\n👉 Xem tour Thái Lan tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['singapore'],
    answer: '🇸🇬 **Singapore** — Quốc đảo sư tử sạch đẹp nhất thế giới!\n\n📍 **Điểm đến nổi bật:**\n- 🌳 Gardens by the Bay\n- 🦁 Công viên Merlion\n- 🎡 Đảo Sentosa & Universal Studios\n- 🛍️ Đại lộ Orchard\n\n🦀 **Ẩm thực:** Cua sốt ớt (Chili Crab), cơm gà Hải Nam\n\n👉 Khám phá Singapore tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['tokyo', 'nhật bản', 'nhat ban'],
    answer: '🇯🇵 **Tokyo (Nhật Bản)** — Sự giao thoa giữa truyền thống và hiện đại!\n\n📍 **Điểm đến nổi bật:**\n- 🗼 Tháp Tokyo, Shibuya Crossing\n- 🛕 Đền Senso-ji\n- 🏰 Cung điện Hoàng gia\n- 🗻 Núi Phú Sĩ (cách 2h đi xe)\n\n🍣 **Ẩm thực:** Sushi, Ramen, Tempura\n\n👉 Đặt tour Nhật Bản tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['seoul', 'hàn quốc', 'han quoc'],
    answer: '🇰🇷 **Seoul (Hàn Quốc)** — Xứ sở Kim Chi đầy quyến rũ!\n\n📍 **Điểm đến nổi bật:**\n- 🏰 Cung điện Gyeongbokgung\n- 🗼 N Seoul Tower\n- 🛍️ Myeongdong, Gangnam\n- 🎢 Lotte World\n\n🍗 **Ẩm thực:** Kim chi, Kimbap, thịt nướng BBQ\n\n👉 Xem tour Hàn Quốc tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['bali', 'indonesia'],
    answer: '🏝️ **Bali (Indonesia)** — Thiên đường nghỉ dưỡng nhiệt đới!\n\n📍 **Điểm đến nổi bật:**\n- 🌊 Ruộng bậc thang Ubud\n- 🛕 Đền Uluwatu, Đền Tanah Lot\n- 🏖️ Bãi biển Kuta, Seminyak\n\n🍹 **Ẩm thực:** Nasi Goreng, Satay\n\n👉 Xem tour Bali tại [Tour du lịch](/tours)!',
  },

  // ── Vietnam Destinations ──
  {
    keywords: ['đà nẵng', 'da nang'],
    answer: '🏖️ **Đà Nẵng** — Thành phố đáng sống nhất Việt Nam!\n\n📍 **Điểm đến nổi bật:**\n- 🌉 Cầu Rồng, cầu Vàng (Bà Nà Hills)\n- 🏖️ Biển Mỹ Khê\n- ⛰️ Ngũ Hành Sơn, Bán đảo Sơn Trà\n\n🍜 **Ẩm thực:** Mì Quảng, bánh tráng cuốn thịt heo\n\n👉 Xem tour Đà Nẵng tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['hà nội', 'ha noi'],
    answer: '🏯 **Hà Nội** — Thủ đô nghìn năm văn hiến!\n\n📍 **Điểm đến nổi bật:**\n- 🏛️ Phố cổ 36 phố phường\n- 🌊 Hồ Gươm, Lăng Bác\n- 🏯 Văn Miếu Quốc Tử Giám\n\n🍜 **Ẩm thực:** Phở, bún chả, cà phê trứng\n\n👉 Xem tour Hà Nội tại [Tour du lịch](/tours)!',
  },
  {
    keywords: ['phú quốc', 'phu quoc'],
    answer: '🏝️ **Phú Quốc** — Đảo Ngọc xanh mướt!\n\n📍 **Điểm đến nổi bật:**\n- 🏖️ Bãi Sao, Bãi Dài\n- 🎡 VinWonders, Safari\n- 🚠 Cáp treo Hòn Thơm\n\n👉 Xem tour Phú Quốc tại [Tour du lịch](/tours)!',
  },
  {
      keywords: ['đia điểm du lịch', 'gợi ý', 'đi đâu', 'dia diem du lich', 'di dau'],
      answer: '🌟 **Gợi ý địa điểm du lịch hấp dẫn:**\n\n🇻🇳 **Trong nước:** Hà Nội, Đà Nẵng, Phú Quốc, Sa Pa, Đà Lạt, Nha Trang...\n🌏 **Quốc tế:** Thái Lan (Bangkok), Singapore, Nhật Bản (Tokyo), Hàn Quốc (Seoul), Bali...\n\n👉 Xem tất cả tại [Tour du lịch](/tours)!',
  },

  // ── Services ──
  {
    keywords: ['vé máy bay', 've may bay', 'bay'],
    answer: '✈️ **Đặt vé máy bay tại TravelEasy:**\n- Nhiều hãng bay: Vietnam Airlines, Vietjet, Bamboo...\n- Giá cạnh tranh, đặt chỗ nhanh chóng.\n\n👉 Tìm vé tại [Đặt vé máy bay](/flights)!',
  },
  {
    keywords: ['khách sạn', 'khach san', 'phòng', 'phong'],
    answer: '🏨 **Tìm phòng khách sạn:**\n- Hơn 1.000 khách sạn liên kết trên toàn quốc.\n- Giá ưu đãi, cam kết chất lượng.\n\n👉 Xem tại [Khách sạn](/hotels)!',
  },
  {
    keywords: ['tour', 'du lịch', 'du lich'],
    answer: '🗺️ **Tour du lịch hấp dẫn:**\n- Lịch trình phong phú, hướng dẫn viên chuyên nghiệp.\n- Tour trong nước & quốc tế giá tốt.\n\n👉 Xem tại [Tour du lịch](/tours)!',
  },

  // ── Thanks ──
  {
    keywords: ['cảm ơn', 'cam on', 'thank', 'thanks', 'tuyệt', 'ok'],
    answer: '😊 Rất vui khi được giúp bạn! Nếu cần thêm thông tin gì, đừng ngần ngại hỏi mình nhé. Chúc bạn một ngày tốt lành!',
  },
];

function getLocalResponse(text: string): string {
  const lower = text.toLowerCase().trim();
  const normalizedLower = removeDiacritics(lower);
  
  for (const rule of localRules) {
    // Check both original lower and normalized lower against keywords
    const isMatched = rule.keywords.some(kw => {
        const lowerKw = kw.toLowerCase();
        const normalizedKw = removeDiacritics(lowerKw);
        return lower.includes(lowerKw) || normalizedLower.includes(normalizedKw);
    });

    if (isMatched) {
      return typeof rule.answer === 'function' ? rule.answer() : rule.answer;
    }
  }

  return '🤖 Xin lỗi, mình chưa hiểu rõ ý bạn. Bạn có thể hỏi về:\n- 🗺️ Địa điểm du lịch (Hà Nội, Bangkok...)\n- ✈️ Vé máy bay, khách sạn, tour\n- 🕐 Giờ giấc, thời gian\n\nHoặc liên hệ nhân viên ở tab **"Nhân viên"** nhé! 😊';
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
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
