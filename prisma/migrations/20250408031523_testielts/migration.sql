-- CreateTable
CREATE TABLE "ielts_mock_test_questions" (
    "id" SERIAL NOT NULL,
    "mock_test_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "options" TEXT,
    "correct_answer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ielts_mock_test_questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ielts_mock_test_questions" ADD CONSTRAINT "ielts_mock_test_questions_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "ielts_mock_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
