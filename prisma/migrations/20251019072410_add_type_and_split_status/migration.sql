/*
  Warnings:

  - You are about to drop the column `status` on the `TestCase` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TestCaseType" AS ENUM ('FUNCTIONAL', 'NON_FUNCTIONAL', 'PERFORMANCE');

-- CreateEnum
CREATE TYPE "TestCaseReviewStatus" AS ENUM ('NEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TestCaseProgress" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "status",
ADD COLUMN     "progress" "TestCaseProgress" NOT NULL DEFAULT 'TODO',
ADD COLUMN     "reviewStatus" "TestCaseReviewStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "type" "TestCaseType" NOT NULL DEFAULT 'FUNCTIONAL';

-- DropEnum
DROP TYPE "TestCaseStatus";
