/*
  Warnings:

  - The values [course] on the enum `payment_reference_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `skill` on the `ielts_skill_results` table. All the data in the column will be lost.
  - You are about to drop the column `test_id` on the `ielts_skill_results` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ielts_skill_results` table. All the data in the column will be lost.
  - You are about to drop the `course_registrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `study_abroad_consultations` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "consultation_type_enum" AS ENUM ('course', 'study_abroad', 'general');

-- AlterEnum
BEGIN;
CREATE TYPE "payment_reference_enum_new" AS ENUM ('ielts_exam', 'ielts_mock_center', 'ielts_mock_online');
ALTER TABLE "payments" ALTER COLUMN "reference_type" TYPE "payment_reference_enum_new" USING ("reference_type"::text::"payment_reference_enum_new");
ALTER TYPE "payment_reference_enum" RENAME TO "payment_reference_enum_old";
ALTER TYPE "payment_reference_enum_new" RENAME TO "payment_reference_enum";
DROP TYPE "payment_reference_enum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "consultations" DROP CONSTRAINT "consultations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "course_registrations" DROP CONSTRAINT "course_registrations_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_registrations" DROP CONSTRAINT "course_registrations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ielts_exam_registrations" DROP CONSTRAINT "ielts_exam_registrations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ielts_skill_results" DROP CONSTRAINT "ielts_skill_results_test_id_fkey";

-- DropForeignKey
ALTER TABLE "ielts_skill_results" DROP CONSTRAINT "ielts_skill_results_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "consultation_type" "consultation_type_enum",
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ielts_exam_registrations" ADD COLUMN     "test_id" INTEGER,
ALTER COLUMN "exam_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "location" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ielts_skill_results" DROP COLUMN "skill",
DROP COLUMN "test_id",
DROP COLUMN "user_id",
ADD COLUMN     "answer_detail" TEXT,
ADD COLUMN     "registration_id" INTEGER,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ielts_tests" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "job_applications" ALTER COLUMN "full_name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "cv_url" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "created_at" TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "invoice_url" SET DATA TYPE TEXT,
ALTER COLUMN "payment_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "full_name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "avatar" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "course_registrations";

-- DropTable
DROP TABLE "leads";

-- DropTable
DROP TABLE "study_abroad_consultations";

-- CreateTable
CREATE TABLE "ielts_mock_tests" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "skill" "skill_enum",
    "created_at" TIMESTAMP(3),

    CONSTRAINT "ielts_mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_mock_registrations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "mock_test_id" INTEGER,
    "exam_date" TIMESTAMP(3),
    "status" "registration_status_enum",
    "created_at" TIMESTAMP(3),

    CONSTRAINT "ielts_mock_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_mock_results" (
    "id" SERIAL NOT NULL,
    "registration_id" INTEGER,
    "score" DOUBLE PRECISION,
    "answer_detail" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "ielts_mock_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_center_mock_tests" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "skill" "skill_enum",
    "created_at" TIMESTAMP(3),

    CONSTRAINT "ielts_center_mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_center_mock_registrations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "center_mock_test_id" INTEGER,
    "exam_date" TIMESTAMP(3),
    "location" TEXT,
    "status" "registration_status_enum",
    "created_at" TIMESTAMP(3),

    CONSTRAINT "ielts_center_mock_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_center_mock_results" (
    "id" SERIAL NOT NULL,
    "registration_id" INTEGER,
    "score" DOUBLE PRECISION,
    "answer_detail" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "ielts_center_mock_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ielts_exam_registrations" ADD CONSTRAINT "ielts_exam_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_exam_registrations" ADD CONSTRAINT "ielts_exam_registrations_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "ielts_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_skill_results" ADD CONSTRAINT "ielts_skill_results_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "ielts_exam_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_mock_registrations" ADD CONSTRAINT "ielts_mock_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_mock_registrations" ADD CONSTRAINT "ielts_mock_registrations_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "ielts_mock_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_mock_results" ADD CONSTRAINT "ielts_mock_results_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "ielts_mock_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_center_mock_registrations" ADD CONSTRAINT "ielts_center_mock_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_center_mock_registrations" ADD CONSTRAINT "ielts_center_mock_registrations_center_mock_test_id_fkey" FOREIGN KEY ("center_mock_test_id") REFERENCES "ielts_center_mock_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_center_mock_results" ADD CONSTRAINT "ielts_center_mock_results_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "ielts_center_mock_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
