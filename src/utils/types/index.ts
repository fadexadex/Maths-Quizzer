import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ITopicContext{
  name: string;
  materials: string;
}

export interface CleanedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface incorrectQuestions {
  question: string;
  correctAnswer: string;
  explanation: string;
  options: string[];
}


export type TokenPayload = Omit<Prisma.UserCreateInput, "password">;

