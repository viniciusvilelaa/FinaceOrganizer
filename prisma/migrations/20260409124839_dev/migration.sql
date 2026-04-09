/*
  Warnings:

  - You are about to drop the column `Amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `Category` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `Date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `Amount`,
    DROP COLUMN `Category`,
    DROP COLUMN `Date`,
    DROP COLUMN `Description`,
    DROP COLUMN `Type`,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `category` ENUM('COMIDA', 'TRANSPORTE', 'LAZER') NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
