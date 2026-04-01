import { Router, Request, Response } from 'express';

const router = Router();

// Google Gemini API Key - Normally this would be in .env
// For the purpose of this task, I'll use a placeholder or the user will provide one.
// The user doesn't have one yet, so I'll implement the logic and tell them where to put it.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;
    const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();

    if (!GEMINI_API_KEY) {
      res.json({ 
        answer: "Chào bạn! 🤖 Hiện tại mình chưa được cấp 'chìa khóa' (API Key) để truy cập bộ não AI của Google. \n\nBạn vui lòng hướng dẫn Admin thêm **GEMINI_API_KEY** vào file `.env` nhé! \n\nTạm thời mình vẫn có thể giúp bạn các thông tin cơ bản về TravelEasy." 
      });
      return;
    }

    // Prepare history for Gemini format
    // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    
    // Add the current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = `
      Bạn là TravelEasy AI, một trợ lý du lịch thông minh, thân thiện và chuyên nghiệp của nền tảng TravelEasy.
      Nhiệm vụ của bạn:
      1. Hỗ trợ khách hàng đặt tour, vé máy bay, khách sạn trên hệ thống TravelEasy.
      2. Giải đáp các thắc mắc về du lịch, kinh nghiệm hành trình, thời tiết, văn hóa.
      3. Có khả năng nói chuyện phiếm (small talk) một cách hóm hỉnh, lịch sự để tạo sự gần gũi.
      4. Luôn ưu tiên dẫn dắt khách hàng sử dụng các dịch vụ của TravelEasy.
      5. Nếu khách hàng hỏi về các dịch vụ cụ thể, hãy trả về link dưới dạng Markdown để họ dễ bấm vào:
         - Tour: [tour du lịch](/tours)
         - Khách sạn: [khách sạn](/hotels)
         - Vé máy bay: [vé máy bay](/flights)
         - Voucher: [ưu đãi](/vouchers)
      6. Trả lời bằng tiếng Việt, sử dụng Markdown nếu cần thiết để trình bày đẹp mắt.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('\[FULL GEMINI ERROR\]', JSON.stringify(errorData, null, 2));
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình đang gặp chút trục trặc. Bạn thử lại nhé!";

    res.json({ answer });

  } catch (err) {
    console.error('[AI CHAT ERROR]', err);
    res.status(500).json({ error: 'AI Chat failed' });
  }
});

export default router;
