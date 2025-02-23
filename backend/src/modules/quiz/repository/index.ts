import { Prisma, PrismaClient } from "@prisma/client";
import { CleanedQuestion } from "../../../utils/types";
import { generateRawQuestions } from "../../../utils/generateQuestions";

export class QuizRepository {
  private prisma = new PrismaClient();

  async createTopicWithMaterials(
    data: Prisma.TopicCreateInput,
    userId: string
  ) {
    return this.prisma.topic.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getTopicById(topicId: string) {
    return this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        sessions: {
          select: { id: true, completed: true, score: true }, 
        },
      },
    });
  }

  async createQuizSession(
    topicId: string,
    cleanedQuestions: CleanedQuestion[]
  ) {
    return this.prisma.quizSession.create({
      data: {
        topicId,
        questions: {
          create: cleanedQuestions.map((q) => ({
            questionText: q.question,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            options: q.options,
          })),
        },
      },
      include: { questions: true },
    });
  }


  async getUserTopics(userId: string) {
    return this.prisma.topic.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
  }
  

  async saveQuizProgress(sessionId: string, answers: { questionId: string; userAnswer: string | null }[]) {
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { questions: true }
    });
  
    if (!session) throw new Error("Quiz session not found");
  
    await this.prisma.$transaction(
      answers.map(answer => 
        this.prisma.quizQuestion.update({
          where: { id: answer.questionId },
          data: { userAnswer: answer.userAnswer },
        })
      )
    );
  
    return { message: "Progress saved successfully" };
  }
  

  async completeQuizSession(sessionId: string, score: number) {
    return this.prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        score,
      },
    });
  }

  async getQuizSessionById(sessionId: string) {
    return this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });
  }

  async submitQuizAnswers(
    sessionId: string,
    answers: { questionId: string; userAnswer: string }[]
  ) {
    let correctCount = 0;

    await Promise.all(
      answers.map(async (answer) => {
        const question = await this.prisma.quizQuestion.findUnique({
          where: { id: answer.questionId },
        });

        if (!question) return;

        const isCorrect = question.correctAnswer === answer.userAnswer;
        if (isCorrect) correctCount++;

        await this.prisma.quizQuestion.update({
          where: { id: answer.questionId },
          data: {
            userAnswer: answer.userAnswer,
            isCorrect,
          },
        });
      })
    );

    return this.completeQuizSession(sessionId, correctCount);
  }

  async reviewQuizSession(sessionId: string) {
    return this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });
  }

  async regenerateQuizSession(sessionId: string) {
    const previousSession = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });

    if (!previousSession) {
      throw new Error("No previous quiz session found.");
    }

    const incorrectQuestions = previousSession.questions
      .filter((q) => q.isCorrect === false)
      .map((q) => ({
        question: q.questionText,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        options: q.options,
      }));

    if (incorrectQuestions.length === 0) {
      throw new Error("No incorrect answers to generate a new quiz.");
    }

    const rawQuestions = await generateRawQuestions(
      undefined,
      incorrectQuestions
    );

    if (!rawQuestions) {
      throw new Error("No questions generated");
    }

    const cleanedQuestions = JSON.parse(rawQuestions);

    return this.createQuizSession(previousSession.topicId, cleanedQuestions);
  }
}
