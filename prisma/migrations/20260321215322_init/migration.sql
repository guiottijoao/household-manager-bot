/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "person" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "estimatedTimeMin" INTEGER NOT NULL,
    "content" TEXT NOT NULL
);
