/*
  Warnings:

  - The primary key for the `CLO` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CLO" DROP CONSTRAINT "CLO_CourseId_fkey";

-- AlterTable
ALTER TABLE "CLO" DROP CONSTRAINT "CLO_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "CourseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CLO_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CLO" ADD CONSTRAINT "CLO_CourseId_fkey" FOREIGN KEY ("CourseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
