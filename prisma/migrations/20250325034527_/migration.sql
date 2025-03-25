/*
  Warnings:

  - You are about to drop the `ielts_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "skill_enum" AS ENUM ('listening', 'reading', 'writing', 'speaking');

-- CreateEnum
CREATE TYPE "payment_method_enum" AS ENUM ('QR', 'PayOS', 'other');

-- DropForeignKey
ALTER TABLE "ielts_results" DROP CONSTRAINT "ielts_results_test_id_fkey";

-- DropForeignKey
ALTER TABLE "ielts_results" DROP CONSTRAINT "ielts_results_user_id_fkey";

-- AlterTable
ALTER TABLE "ielts_exam_registrations" ADD COLUMN     "is_at_center" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "ielts_tests" ADD COLUMN     "skill" "skill_enum";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "invoice_sent" BOOLEAN DEFAULT false,
ADD COLUMN     "payment_method" "payment_method_enum";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" VARCHAR(255);

-- DropTable
DROP TABLE "ielts_results";

-- CreateTable
CREATE TABLE "ielts_skill_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "test_id" INTEGER,
    "skill" "skill_enum",
    "score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "ielts_skill_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "cv_url" VARCHAR(255),
    "message" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_abroad_consultations" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "message" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "study_abroad_consultations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ielts_skill_results" ADD CONSTRAINT "ielts_skill_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ielts_skill_results" ADD CONSTRAINT "ielts_skill_results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "ielts_tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
