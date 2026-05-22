/*
  Warnings:

  - A unique constraint covering the columns `[userId,month,year]` on the table `FinancialGoal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId]` on the table `FinancialGoal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `FinancialGoal_userId_month_year_key` ON `FinancialGoal`(`userId`, `month`, `year`);

-- CreateIndex
CREATE UNIQUE INDEX `FinancialGoal_id_userId_key` ON `FinancialGoal`(`id`, `userId`);
