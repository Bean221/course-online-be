-- CreateEnum
CREATE TYPE "consult_status_enum" AS ENUM ('pending', 'in_progress', 'done');

-- CreateEnum
CREATE TYPE "payment_reference_enum" AS ENUM ('course', 'ielts_exam');

-- CreateEnum
CREATE TYPE "payment_status_enum" AS ENUM ('pending', 'success', 'failed');

-- CreateEnum
CREATE TYPE "registration_status_enum" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('student', 'manager', 'admin');

-- CreateTable
CREATE TABLE "consultations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "message" TEXT,
    "status" "consult_status_enum",
    "created_at" TIMESTAMP(6),

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_registrations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "course_id" INTEGER,
    "status" "registration_status_enum",
    "created_at" TIMESTAMP(6),

    CONSTRAINT "course_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "price" DECIMAL(10,2),
    "is_online" BOOLEAN,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_exam_registrations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "exam_date" DATE,
    "location" VARCHAR(255),
    "status" "registration_status_enum",
    "created_at" TIMESTAMP(6),

    CONSTRAINT "ielts_exam_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "test_id" INTEGER,
    "listening" DOUBLE PRECISION,
    "reading" DOUBLE PRECISION,
    "writing" DOUBLE PRECISION,
    "speaking" DOUBLE PRECISION,
    "overall" DOUBLE PRECISION,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "ielts_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_tests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "ielts_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "message" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "reference_type" "payment_reference_enum",
    "reference_id" INTEGER,
    "amount" DECIMAL(10,2),
    "status" "payment_status_enum",
    "invoice_url" VARCHAR(255),
    "payment_date" TIMESTAMP(6),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "phone" VARCHAR(20),
    "role" "role_enum",
    "created_at" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_registrations" ADD CONSTRAINT "course_registrations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_registrations" ADD CONSTRAINT "course_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ielts_exam_registrations" ADD CONSTRAINT "ielts_exam_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ielts_results" ADD CONSTRAINT "ielts_results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "ielts_tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ielts_results" ADD CONSTRAINT "ielts_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
