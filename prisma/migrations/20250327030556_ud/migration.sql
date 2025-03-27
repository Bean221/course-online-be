-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_center_mock_registrations" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_center_mock_results" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_center_mock_tests" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_exam_registrations" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_mock_registrations" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_mock_results" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_mock_tests" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_skill_results" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ielts_tests" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "payment_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
