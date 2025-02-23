import Groq from "groq-sdk";
import dotenv from "dotenv";
import { CleanedQuestion, incorrectQuestions, ITopicContext } from "./types";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateRawQuestions = async (topicContext?: ITopicContext, wrongQuestions?: incorrectQuestions[]) => {
  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You are an AI math quiz generator. Generate exactly ** 15 structured math quiz questions** in **raw JSON array format**, without any extra text.
        Generate based on this context  **${topicContext}**:

        **🔹 OUTPUT FORMAT:**  
        Return **only a valid JSON array**, structured exactly like this:

        [
          {
            "question": "<math_problem>",
            "options": ["<option_1>", "<option_2>", "<option_3>", "<option_4>"],
            "correctAnswer": "<correct_option>",
            "explanation": "<step-by-step_explanation>"
          }
        ]
        
        **🔹 GUIDELINES:**  
        - Ensure **exactly 15** questions.
        - Vary difficulty levels (**easy, medium, hard**).
        - Include **four answer options**, with only one correct.
        - Provide a **detailed explanation** breaking down the solution step-by-step.
        - Ensure **options contain plausible wrong answers** to make it challenging.
        - Avoid vague or ambiguous wording in questions.
        - there is possibly going to a null topic name, if that is the case just regenerate questions with different values based this wrong questions:${wrongQuestions}, still make the number 15 no matter the amount of wrong questions. if the wrong questions are available, then base the questions on the wrong questions, so the 15 questions now should be a variation of the wrong questions. And ensure no question out of the wrong question is repeated.

        
        **🔹 STRICT RULES:**  
        1️⃣ **Do not include** any introductory/explanatory text.  
        2️⃣ **Do not wrap the questions inside a JSON object** (just return an array ).  
        3️⃣ **No extra formatting, text, or comments**—only **pure JSON**.  

        **🔹 EXAMPLE OUTPUT:**  

        [
          {
            "question": "What is the derivative of 2x²?",
            "options": ["2x", "4x", "x²", "x"],
            "correctAnswer": "4x",
            "explanation": "The derivative of 2x² is found using the power rule: d/dx(ax^n) = n*ax^(n-1)."
          },
          {
            "question": "What is the integral of 3x² dx?",
            "options": ["x³ + C", "x² + C", "3x + C", "x^3/3 + C"],
            "correctAnswer": "x^3/3 + C",
            "explanation": "The integral of 3x² is found using the power rule for integration: ∫ ax^n dx = ax^(n+1)/(n+1) + C."
          }
        ]
        `,
      },
      {
        role: "user",
        content: `Topic: ${topicContext?.name}, there is possibly going to a null topic name, if that is the case just regenerate questions with different values based this wrong questions: ${wrongQuestions}`,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 2500,
    top_p: 1,
    stop: null,
    stream: false,
  });

  return res.choices[0]?.message?.content || "";
};
