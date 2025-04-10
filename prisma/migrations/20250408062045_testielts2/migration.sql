/*
  Warnings:

  - You are about to drop the column `registration_id` on the `ielts_mock_results` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `ielts_mock_results` table. All the data in the column will be lost.
  - You are about to drop the column `skill` on the `ielts_mock_tests` table. All the data in the column will be lost.
  - You are about to drop the `ielts_mock_registrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mock_test_id` to the `ielts_mock_results` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `ielts_mock_results` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `ielts_mock_results` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `skill` to the `ielts_mock_test_questions` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `ielts_mock_tests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `ielts_mock_tests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `ielts_mock_tests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ielts_mock_registrations" DROP CONSTRAINT "ielts_mock_registrations_mock_test_id_fkey";

-- DropForeignKey
ALTER TABLE "ielts_mock_registrations" DROP CONSTRAINT "ielts_mock_registrations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ielts_mock_results" DROP CONSTRAINT "ielts_mock_results_registration_id_fkey";

-- AlterTable
ALTER TABLE "ielts_mock_results" DROP COLUMN "registration_id",
DROP COLUMN "score",
ADD COLUMN     "listening_audio_url" TEXT,
ADD COLUMN     "listening_score" DOUBLE PRECISION,
ADD COLUMN     "mock_test_id" INTEGER NOT NULL,
ADD COLUMN     "reading_score" DOUBLE PRECISION,
ADD COLUMN     "speaking_audio_url" TEXT,
ADD COLUMN     "speaking_score" DOUBLE PRECISION,
ADD COLUMN     "user_id" INTEGER,
ADD COLUMN     "writing_score" DOUBLE PRECISION,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "ielts_mock_test_questions" ADD COLUMN     "skill" "skill_enum" NOT NULL,
ADD COLUMN     "task_number" INTEGER;

-- AlterTable
ALTER TABLE "ielts_mock_tests" DROP COLUMN "skill",
ADD COLUMN     "listening" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reading" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "speaking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "writing" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- DropTable
DROP TABLE "ielts_mock_registrations";

-- AddForeignKey
ALTER TABLE "ielts_mock_results" ADD CONSTRAINT "ielts_mock_results_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "ielts_mock_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
