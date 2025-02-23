import { QuizRepository } from "../repository";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middleware/errorHandler";
import { generateRawQuestions } from "../../../utils/generateQuestions";

const quizRepo = new QuizRepository();

export class QuizService {
  async createTopicWithMaterials(
    data: Prisma.TopicCreateInput,
    userId: string
  ) {
    return quizRepo.createTopicWithMaterials(data, userId);
  }

  async getTopicById(topicId: string) {
    const topic = await quizRepo.getTopicById(topicId);
    if (!topic) {
      throw new AppError("Topic not found", StatusCodes.NOT_FOUND);
    }
    return topic;
  }

  async getUserTopics(userId: string) {
    return quizRepo.getUserTopics(userId);
  }

  async createQuizSession(topicId: string) {
    const topic = await quizRepo.getTopicById(topicId);
    if (!topic) {
      throw new AppError("Topic not found", StatusCodes.NOT_FOUND);
    }
    const topicContext = {
      name: topic.name,
      materials: topic.materials,
    };

    const rawQuestions = await generateRawQuestions(topicContext);
    if (!rawQuestions) {
      throw new AppError(
        "No questions generated",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const cleanedQuestions = JSON.parse(rawQuestions);
    const quizSession = await quizRepo.createQuizSession(
      topicId,
      cleanedQuestions
    );

    return {
      sessionId: quizSession.id,
      count: quizSession.questions.length,
      questions: quizSession.questions.map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        options: q.options,
      })),
    };
  }

  async getQuizSessionById(sessionId: string) {
    const quizSession = await quizRepo.getQuizSessionById(sessionId);
    if (!quizSession) {
      throw new AppError("Quiz session not found", StatusCodes.NOT_FOUND);
    }
    if (quizSession.completed) {
      throw new AppError(
        "Quiz session already completed",
        StatusCodes.BAD_REQUEST
      );
    }
    return quizSession;
  }

  async saveQuizProgress(sessionId: string, answers: { questionId: string; userAnswer: string | null }[]) {
    return quizRepo.saveQuizProgress(sessionId, answers);
  }

  async submitQuizAnswers(
    sessionId: string,
    answers: { questionId: string; userAnswer: string }[]
  ) {
    const quizSession = await quizRepo.getQuizSessionById(sessionId);
    if (!quizSession) {
      throw new AppError("Quiz session not found", StatusCodes.NOT_FOUND);
    }
    return quizRepo.submitQuizAnswers(sessionId, answers);
  }

  async completeQuizSession(sessionId: string, score: number) {
    return quizRepo.completeQuizSession(sessionId, score);
  }

  async reviewQuizSession(sessionId: string) {
    const quizSession = await quizRepo.reviewQuizSession(sessionId);
    if (!quizSession) {
      throw new AppError("Quiz session not found", StatusCodes.NOT_FOUND);
    }
    return {
      sessionId: quizSession.id,
      topicId: quizSession.topicId,
      questions: quizSession.questions.map((q) => ({
        questionText: q.questionText,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect: q.isCorrect,
      })),
    };
  }

  async regenerateQuizSession(sessionId: string) {
    return quizRepo.regenerateQuizSession(sessionId);
  }
}
