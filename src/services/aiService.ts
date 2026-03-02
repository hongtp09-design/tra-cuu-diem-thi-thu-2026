import { GoogleGenAI } from "@google/genai";
import { Student } from "../data/students";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIAdvising(student: Student) {
  const model = "gemini-3-flash-preview";
  
  const scoresText = Object.entries(student.scores)
    .map(([subject, score]) => `${subject}: ${score}`)
    .join(", ");

  const prompt = `
    Bạn là một chuyên gia tư vấn giáo dục và hướng nghiệp tại Việt Nam.
    Hãy phân tích kết quả thi của học sinh sau đây và đưa ra lời khuyên:
    
    Thông tin học sinh:
    - Họ tên: ${student.name}
    - Lớp: ${student.class}
    - Điểm số: ${scoresText}
    
    Yêu cầu:
    1. Phân tích điểm mạnh, điểm yếu dựa trên các môn học.
    2. Đưa ra lời khuyên học tập cụ thể để cải thiện các môn điểm thấp hoặc phát huy môn điểm cao.
    3. Tư vấn hướng nghiệp: Gợi ý các khối thi (A00, A01, B00, C00, D01...) phù hợp và các ngành nghề triển vọng dựa trên năng lực thể hiện qua điểm số.
    4. Lời chúc động viên.
    
    Hãy trả lời bằng tiếng Việt, định dạng Markdown, chuyên nghiệp và truyền cảm hứng.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Rất tiếc, AI hiện đang bận. Vui lòng thử lại sau.";
  }
}
