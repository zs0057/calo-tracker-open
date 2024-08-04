import { config } from "dotenv";
import OpenAI from "openai";

// Load .env.local file
config({ path: ".env.local" });

// OpenAI 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function openAiRequest(
  base64Image: string,
  text: string
): Promise<string> {
  const prompt = `너는 첨부한 사진과 사용자가 먹었다고 하는 음식 문구를 기준으로 칼로리를 예측하는 영양사야. 
                        주어진 정보가 부족하지만 최대한 비슷한 칼로리로 추론해. 
                        여성 1명이 먹었을 법한 양을 예상해서 추론해야해.
                        너가 생각한 것 보다 살짝 칼로리가 낮게 해서 줘.
                        그리고 텍스트를 우선으로 칼로리 계산해줘.
                        몇명이서 나눠먹은것에 대하여 칼로리를 잘 나눠줘.
                        예시: 셋이 먹었어요, 총 칼로리 / 3
                        대답은 숫자로만 해줘 예시: 354. 
                        그리고 칼로리를 디테일 하게 작성해줘. 1단위로 작성해줘 예를들어 367 칼로리가 나오면 360이라 적지말고 367이라고 정확하게 적어줘.
                        그리고 json형식으로 total_calories는 따로넣고, 추론결과는 어떻게 추론했는지 따로 작성해.
                        실제 json처럼 주고 다른 텍스트는 적지 말아줘.
                        kcal가 먼저나오고 그담에 양이 괄호안에 들어가는 식으로 적어줘.
                        꼭 밑에 예시 json 처럼 줘야 돼.
                        예시: { 
                                  "ai_text": "쌀밥 305kcal(210g), 떡볶이 200kcal(1/3 인분), 김말이 150kcal(3개), 쥐포 50kcal(1/3 인분) 깻잎무침 20kcal(1개), 양념만두 180kcal(3개), 미니돈가스 140kcal(2개) 따라서 총 칼로리는 약 890 kcal 입니다.",
                                  "items": "쌀밥, 떡볶이, 김말이, 쥐포, 깻잎무침, 양념만두, 미니돈가스",
                                  "total_calories": 890
                              }
                        첨부한 텍스트는 "${text}" 이거야.
                        자 이제 답변해주세요. 답변은 반드시 single json object여야합니다. 다른 문장을 추가하지 마세요 특히 \`\`\`json을 쓰지 마세요.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: base64Image,
              detail: "low",
            },
          },
        ],
      },
    ],
  });

  const aiText = response.choices[0].message.content;
  if (aiText === null) {
    throw new Error("님 오픈 ai 리턴값 null");
  }
  return aiText;
}
