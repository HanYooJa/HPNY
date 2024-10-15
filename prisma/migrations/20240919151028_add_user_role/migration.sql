-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SELLER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
