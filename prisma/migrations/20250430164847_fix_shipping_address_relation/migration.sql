/*
  Warnings:

  - A unique constraint covering the columns `[shippingAddressId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `shippingAddressId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `addressLine2` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_shippingAddressId_key` ON `Order`(`shippingAddressId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingAddressId_fkey` FOREIGN KEY (`shippingAddressId`) REFERENCES `ShippingDetail`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
