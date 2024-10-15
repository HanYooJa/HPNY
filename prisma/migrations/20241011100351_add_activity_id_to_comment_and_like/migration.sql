/*
  Warnings:

  - You are about to drop the `_ActivityToBooking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_roomId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToBooking" DROP CONSTRAINT "_ActivityToBooking_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToBooking" DROP CONSTRAINT "_ActivityToBooking_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToComment" DROP CONSTRAINT "_ActivityToComment_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToComment" DROP CONSTRAINT "_ActivityToComment_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToLike" DROP CONSTRAINT "_ActivityToLike_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToLike" DROP CONSTRAINT "_ActivityToLike_B_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "activityId" INTEGER,
ALTER COLUMN "roomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "activityId" INTEGER,
ALTER COLUMN "roomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "activityId" INTEGER,
ALTER COLUMN "roomId" DROP NOT NULL;

-- DropTable
DROP TABLE "_ActivityToBooking";

-- DropTable
DROP TABLE "_ActivityToComment";

-- DropTable
DROP TABLE "_ActivityToLike";

-- CreateIndex
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");

-- CreateIndex
CREATE INDEX "Booking_activityId_idx" ON "Booking"("activityId");

-- CreateIndex
CREATE INDEX "Comment_userId_activityId_idx" ON "Comment"("userId", "activityId");

-- CreateIndex
CREATE INDEX "Like_userId_roomId_idx" ON "Like"("userId", "roomId");

-- CreateIndex
CREATE INDEX "Like_userId_activityId_idx" ON "Like"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
