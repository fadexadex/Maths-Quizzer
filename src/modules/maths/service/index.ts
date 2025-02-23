import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getGroqChatCompletion = async (prompt: string) => {
  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are an AI math quiz generator. Generate a JSON object containing an unlimited number of math quiz questions related to "{topic}". The JSON object should have the following structure:

          {
          "count": <number_of_questions_generated>,
          "quizzes": [
              {
              "question": "<math_problem>",
              "options": ["<option_1>", "<option_2>", "<option_3>", "<option_4>"],
              "correctAnswer": "<correct_option>",
              "explanation": "<step-by-step_explanation>"
              },
              ...
          ]
          }

          Guidelines:
          - Generate a **diverse mix of question difficulties** (easy, medium, hard).
          - Cover different subtopics within "{topic}" (e.g., if the topic is "calculus", include derivatives, integrals, limits, etc.).
          - Ensure "options" contain **plausible wrong answers** to make the quiz more challenging.
          - Each question must have a detailed **explanation** for learning purposes.
          - Return a valid **JSON format** that can be directly parsed.

          Example Output:
          {
          "count": 5,
          "quizzes": [
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
          }

          Note: don't add anything asides the questions, and you are encouraged to generate as much quiz questions as possible.
          In the explanation, break down the steps to solve the problem.
          Generate exactly 15 questions.

          and also don't include anything like: Here's a JSON object containing 15 math quiz questions related to Quantitative Analysis, which is a broad topic that encompasses various mathematical concepts such as algebra, functions, and calculus.
          just give the entire questions and nothing else
  `,
      },

      {
        role: "user",
        content: prompt,
      },
    ],

    model: "llama-3.1-8b-instant",

    temperature: 0.5,

    max_tokens: 6000,

    top_p: 1,
    stop: null,
    stream: false,
  });
  return res.choices[0]?.message?.content || "";
};
