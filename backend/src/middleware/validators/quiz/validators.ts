import { Request, Response, NextFunction } from "express";
import { createTopicSchema } from "./schemas";
import { AppError } from "../../errorHandler";
import { StatusCodes } from "http-status-codes";

export class QuizValidator {
  validateCreateTopic = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createTopicSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return next(
        new AppError(
          error.details.map((err) => err.message).join(", "),
          StatusCodes.BAD_REQUEST
        )
      );
    }

    next();
  };

  validateTopicId = (req: Request, res: Response, next: NextFunction) => {
    const { topicId } = req.params;

    if (!topicId) {
      return next(
        new AppError("Topic ID is required", StatusCodes.BAD_REQUEST)
      );
    }

    next();
  };
}
