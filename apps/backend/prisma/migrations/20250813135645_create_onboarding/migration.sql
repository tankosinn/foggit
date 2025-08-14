-- CreateEnum
CREATE TYPE "public"."OnboardingStep" AS ENUM ('PROFILE', 'WORKSPACE');

-- CreateTable
CREATE TABLE "public"."Onboarding" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "step" "public"."OnboardingStep" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_uuid_key" ON "public"."Onboarding"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_email_step_key" ON "public"."Onboarding"("email", "step");
