/*
  Warnings:

  - Changed the type of `lat` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lng` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lat` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lng` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
*/

-- AlterTable
ALTER TABLE "Activity" 
DROP COLUMN "lat",
ADD COLUMN "lat" DOUBLE PRECISION NOT NULL,
DROP COLUMN "lng",
ADD COLUMN "lng" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Room" 
DROP COLUMN "lat",
ADD COLUMN "lat" DOUBLE PRECISION NOT NULL,
DROP COLUMN "lng",
ADD COLUMN "lng" DOUBLE PRECISION NOT NULL;
