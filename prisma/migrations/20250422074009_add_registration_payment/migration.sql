/*
  Warnings:

  - You are about to drop the column `task_number` on the `ielts_mock_test_questions` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- AlterTable
ALTER TABLE "ielts_mock_results" ADD COLUMN     "overall_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ielts_mock_test_questions" DROP COLUMN "task_number",
ADD COLUMN     "part" INTEGER;

-- AlterTable
ALTER TABLE "ielts_mock_tests" ADD COLUMN     "month" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'all';

-- DropTable
DROP TABLE "payments";

-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "selectedDate" TIMESTAMP(3) NOT NULL,
    "status" "registration_status_enum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "registrationId" INTEGER NOT NULL,
    "userId" INTEGER,
    "payosOrderId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "payment_status_enum" NOT NULL,
    "qrUrl" TEXT,
    "paymentMethod" "payment_method_enum",
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payosOrderId_key" ON "Payment"("payosOrderId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
