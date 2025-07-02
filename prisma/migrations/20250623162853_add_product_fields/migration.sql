-- AlterTable
ALTER TABLE `product` ADD COLUMN `colors` JSON NULL,
    ADD COLUMN `deliveryInfo` VARCHAR(191) NULL,
    ADD COLUMN `sideImages` JSON NULL,
    ADD COLUMN `sizes` JSON NULL,
    ADD COLUMN `specifications` JSON NULL;
