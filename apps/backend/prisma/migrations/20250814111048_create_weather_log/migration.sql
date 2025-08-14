-- CreateTable
CREATE TABLE "public"."WeatherLog" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "workspaceMemberId" INTEGER NOT NULL,
    "query" JSONB NOT NULL,
    "weather" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeatherLog_uuid_key" ON "public"."WeatherLog"("uuid");

-- AddForeignKey
ALTER TABLE "public"."WeatherLog" ADD CONSTRAINT "WeatherLog_workspaceMemberId_fkey" FOREIGN KEY ("workspaceMemberId") REFERENCES "public"."WorkspaceMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
