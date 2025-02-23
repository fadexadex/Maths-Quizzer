import { QuizController } from "./controller";
import { Router } from "express";
import { authGuard } from "../../middleware/auth.middleware";
import { QuizValidator } from "../../middleware/validators/quiz/validators";

const router = Router();
const quizController = new QuizController();
const quizValidator = new QuizValidator();

router.post(
  "/topic/create",
  authGuard,
  quizValidator.validateCreateTopic,
  quizController.createTopicWithMaterials
);

router.get(
  "/topics",
  authGuard,
  quizController.getUserTopics
);

router.get(
  "/topic/:topicId",
  authGuard,
  quizController.getTopicById
);

router.post(
  "/topic/:topicId/create-quiz-session",
  authGuard,
  quizController.createQuizSession
);

router.get(
  "/quiz-session/:sessionId",
  authGuard,
  quizController.getQuizSessionById
);

router.post(
  "/quiz-session/:sessionId/submit",
  authGuard,
  quizController.submitQuizAnswers
);

router.get(
  "/quiz-session/:sessionId/review",
  authGuard,
  quizController.reviewQuizSession
);

router.post(
  "/quiz-session/:sessionId/regenerate",
  authGuard,
  quizController.regenerateQuizSession
);

export default router;
