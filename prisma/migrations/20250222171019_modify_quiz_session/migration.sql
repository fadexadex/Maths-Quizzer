-- AlterTable
ALTER TABLE "QuizSession" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "score" INTEGER;
