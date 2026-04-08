/*
  Warnings:

  - Added the required column `Category` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `Category` ENUM('COMIDA', 'TRANSPORTE', 'LAZER', 'CASA', 'OUTROS', 'PET') NOT NULL;
