import { Request, Response, NextFunction } from "express";
import { getGroqChatCompletion } from "../service";

export const quizController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { prompt } = req.body;

  try {
    const response = await getGroqChatCompletion(prompt);
    console.log(response);
    const cleanedResponse = JSON.parse(response);
    return res.status(200).json(cleanedResponse);
  } catch (error) {
    next(error);
  }
};
