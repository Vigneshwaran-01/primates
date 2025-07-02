-- AlterTable
ALTER TABLE `order` ADD COLUMN `refundReason` VARCHAR(191) NULL,
    MODIFY `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'refund_requested') NOT NULL DEFAULT 'pending';
