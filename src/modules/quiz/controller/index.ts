import { Request, Response, NextFunction } from "express";
import { QuizService } from "../service";

const quizService = new QuizService();

export class QuizController {
  createTopicWithMaterials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = req.body;

    try {
      const response = await quizService.createTopicWithMaterials(
        data,
        req.user.id
      );

      return res
        .status(201)
        .json({ message: "Topic created successfully", data: response });
    } catch (error) {
      next(error);
    }
  };

  getUserTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await quizService.getUserTopics(req.user.id);
      return res.status(200).json({ message: "User topics retrieved", data: response });
    } catch (error) {
      next(error);
    }
  };

  getTopicById = async (req: Request, res: Response, next: NextFunction) => {
    const { topicId } = req.params;

    try {
      const response = await quizService.getTopicById(topicId);
      return res.status(200).json({ message: "Topic retrieved", data: response });
    } catch (error) {
      next(error);
    }
  };

  createQuizSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { topicId } = req.params;

    try {
      const response = await quizService.createQuizSession(topicId);

      return res
        .status(201)
        .json({ message: "Quiz session created successfully", data: response });
    } catch (error) {
      next(error);
    }
  };


  getQuizSessionById = async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.params;

    try {
      const response = await quizService.getQuizSessionById(sessionId);
      return res.status(200).json({ message: "Quiz session retrieved", data: response });
    } catch (error) {
      next(error);
    }
  };

  submitQuizAnswers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sessionId } = req.params;
    const { answers } = req.body;

    try {
      const response = await quizService.submitQuizAnswers(sessionId, answers);

      return res
        .status(200)
        .json({ message: "Quiz submitted successfully", data: response });
    } catch (error) {
      next(error);
    }
  };

  reviewQuizSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sessionId } = req.params;

    try {
      const response = await quizService.reviewQuizSession(sessionId);

      return res
        .status(200)
        .json({ message: "Quiz review retrieved", data: response });
    } catch (error) {
      next(error);
    }
  };

  regenerateQuizSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sessionId } = req.params;

    try {
      const response = await quizService.regenerateQuizSession(sessionId);

      return res
        .status(201)
        .json({ message: "Quiz regenerated successfully", data: response });
    } catch (error) {
      next(error);
    }
  };
}
