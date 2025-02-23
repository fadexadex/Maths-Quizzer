/*
  Warnings:

  - Added the required column `explanation` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "explanation" TEXT NOT NULL,
ADD COLUMN     "options" TEXT[];
