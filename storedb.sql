-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2025 at 04:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `firstName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `role` enum('super_admin','admin','content_manager','order_manager') NOT NULL DEFAULT 'admin',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `lastLogin` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `email`, `password_hash`, `firstName`, `lastName`, `role`, `isActive`, `lastLogin`, `createdAt`, `updatedAt`) VALUES
(4, 'admin1', 'admin@example.com', '$2y$10$7YdLbaJbetRAdxcxpS2Znu35vt8zMH10JdSl37OdTorJZhX0QsKSC', 'Admin', 'User', 'super_admin', 1, NULL, '2025-06-24 15:30:33.954', '2025-06-24 15:30:33.954');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `addedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `parentId`, `imageUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES
(11, 'Electronics', 'Electronic gadgets and devices', NULL, NULL, 1, '2025-06-24 15:30:33.547', '2025-06-24 15:30:33.547'),
(12, 'Clothing', 'Men and women clothing', NULL, NULL, 1, '2025-06-24 15:30:33.573', '2025-06-24 15:30:33.573');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `orderDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `totalAmount` double NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled','refunded','refund_requested') NOT NULL DEFAULT 'pending',
  `paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `trackingNumber` varchar(191) DEFAULT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `shippingAddressId` int(11) DEFAULT NULL,
  `refundReason` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `userId`, `orderDate`, `totalAmount`, `status`, `paymentStatus`, `trackingNumber`, `notes`, `shippingAddressId`, `refundReason`) VALUES
(3, 9, '2025-06-24 15:30:33.965', 629.98, 'processing', 'paid', NULL, NULL, NULL, NULL),
(5, 11, '2025-06-26 16:31:08.697', 629.99, 'refunded', 'paid', 'gfg5454', NULL, NULL, 'refund'),
(6, 11, '2025-06-26 16:45:00.686', 599.99, 'delivered', 'paid', 'new 65545', NULL, NULL, NULL),
(7, 11, '2025-06-29 13:59:18.984', 1300, 'shipped', 'paid', '15152121', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` double NOT NULL,
  `discountAmount` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `orderId`, `productId`, `quantity`, `unitPrice`, `discountAmount`) VALUES
(6, 3, 16, 1, 30, 0),
(8, 5, 16, 1, 30, 0),
(11, 7, 18, 1, 500, 0),
(12, 7, 17, 1, 800, 0);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `paymentMethod` varchar(191) NOT NULL,
  `transactionId` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'INR',
  `status` enum('pending','paid','failed','refunded') NOT NULL,
  `paymentDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `razorpayOrderId` varchar(191) DEFAULT NULL,
  `razorpayPaymentId` varchar(191) DEFAULT NULL,
  `razorpaySignature` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `orderId`, `paymentMethod`, `transactionId`, `amount`, `currency`, `status`, `paymentDate`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`) VALUES
(3, 3, 'credit_card', 'txn_123456789', 629.98, 'INR', 'paid', '2025-06-24 15:30:33.965', NULL, NULL, NULL),
(4, 5, 'razorpay', 'cash_1750955468693', 629.99, 'INR', 'paid', '2025-06-26 16:31:08.697', NULL, NULL, NULL),
(5, 6, 'razorpay', 'cash_1750956300679', 599.99, 'INR', 'paid', '2025-06-26 16:45:00.686', NULL, NULL, NULL),
(6, 7, 'razorpay', 'cash_1751205558977', 1300, 'INR', 'paid', '2025-06-29 13:59:18.984', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `price` double NOT NULL,
  `discountedPrice` double DEFAULT NULL,
  `categoryId` int(11) NOT NULL,
  `stockQuantity` int(11) NOT NULL DEFAULT 0,
  `sku` varchar(191) NOT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `additionalImages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additionalImages`)),
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors`)),
  `deliveryInfo` varchar(191) DEFAULT NULL,
  `sideImages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sideImages`)),
  `sizes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sizes`)),
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `discountedPrice`, `categoryId`, `stockQuantity`, `sku`, `imageUrl`, `additionalImages`, `isFeatured`, `isActive`, `createdAt`, `updatedAt`, `colors`, `deliveryInfo`, `sideImages`, `sizes`, `specifications`) VALUES
(16, 'Men\'s Gym Tank Top - Breathable Mesh', 'Breathable and lightweight tank top for maximum ventilation during workouts. Ideal for hot weather or intense training. Quick-drying fabric.', 30, NULL, 12, 150, 'CLOTH-TANK-M', 'https://res.cloudinary.com/dqobnxxos/image/upload/v1749918098/photo-1635105864405-3e75f624d8aa_hsjtc6.jpg', '[\"https://res.cloudinary.com/dqobnxxos/image/upload/v1749917840/photo-1727291332582-2a3ae6214dbe_hzwk9z.jpg\",\"https://res.cloudinary.com/dqobnxxos/image/upload/v1749916919/photo-1691916164439-eb672243bdc7_kgbpef.jpg\",\"https://res.cloudinary.com/dqobnxxos/image/upload/v1749918098/photo-1635105864405-3e75f624d8aa_hsjtc6.jpg\",\"https://res.cloudinary.com/dqobnxxos/image/upload/v1749917840/photo-1727291332582-2a3ae6214dbe_hzwk9z.jpg\"]', 0, 1, '2025-06-24 15:30:33.600', '2025-06-29 11:08:10.000', '[\"red\",\"blue\",\"green\",\"black\",\"white\",\"gray\"]', 'Delivery within 5–7 business days. Free shipping on orders over ₹500.', NULL, '[\"XS\",\"S\",\"M\",\"L\",\"XL\",\"2XL\",\"3XL\"]', '{\"Material\":\"Cotton Blend\",\"Fit\":\"Relaxed\",\"Neck\":\"Crew Neck\",\"Sleeve Length\":\"Sleeveless\"}'),
(17, 'Mens Solid Grey Regular Fit Joggers', 'Give your casual wardrobe a stylish lift with these grey joggers. They are crafted from high-quality materials, this comfortable pair features a drawstring closure and slant pocket.', 800, NULL, 12, 50, ' FIT-JOGGERS-M', 'https://res.cloudinary.com/drfppjfv3/image/upload/v1751191516/cd368b1ADJ-421_Grey_1_apywwx.avif', '[\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751191516/cd368b1ADJ-421_Grey_3_eqblgl.avif\",\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751191516/cd368b1ADJ-421_Grey_4_nptvhv.avif\",\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751191516/cd368b1ADJ-421_Grey_2_djxzyq.avif\",\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751191517/cd368b1ADJ-421_Grey_5_wwj0fi.avif\"]', 1, 1, '2025-06-24 15:30:33.600', '2025-06-24 15:30:33.600', '[\"black\",\"gray\"]', 'Delivery within 5–7 business days. Free shipping on orders over ₹500.', NULL, '[\"M\",\"L\",\"XL\",\"2XL\"]', '{\"Material\":\"Cotton Blend\",\"Fit\":\"Relaxed\",\"Sleeve Length\":\"Sleeveless\"}'),
(18, 'Jones Black Regular Fit Solid T-Shirt', 'Elevate Your Look With This Captivating Black Regular Fit Solid T-Shirt From Jack & Jones. Made From High-Quality Cotton, This Piece Features Half Sleeves And A Round Neck', 500, NULL, 12, 30, 'TSH-M-1', 'https://res.cloudinary.com/drfppjfv3/image/upload/v1751192047/e9b3e35MD900766401_1_h5s4mo.avif', '[\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751192076/e9b3e35MD900766401_2_wekpkb.avif\",\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751192076/e9b3e35MD900766401_2_wekpkb.avif\",\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751192115/e9b3e35MD900766401_4_qbex2i.avif\",\"https://res.cloudinary.com/drfppjfv3/image/upload/v1751192115/e9b3e35MD900766401_3_ebuyab.avif\"]', 1, 1, '2025-06-29 10:17:14.290', '2025-06-29 11:08:13.725', '[\"BLACK\",\"GREY\"]', 'Delivery within 5–7 business days. Free shipping on orders over ₹500.', NULL, '[\"M\",\"L\",\"XL\"]', '{\"Material\":\"Cotton Blend\",\"Fit\":\"Relaxed\",\"Sleeve Length\":\"Sleeveless\"}');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` varchar(191) DEFAULT NULL,
  `reviewDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `isApproved` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shippingdetail`
--

CREATE TABLE `shippingdetail` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phoneNumber` varchar(191) NOT NULL,
  `addressLine1` varchar(191) NOT NULL,
  `addressLine2` varchar(191) DEFAULT NULL,
  `city` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `country` varchar(191) NOT NULL,
  `postalCode` varchar(191) NOT NULL,
  `shippingMethod` varchar(191) DEFAULT NULL,
  `trackingUrl` varchar(191) DEFAULT NULL,
  `estimatedDelivery` datetime(3) DEFAULT NULL,
  `actualDelivery` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shippingdetail`
--

INSERT INTO `shippingdetail` (`id`, `orderId`, `firstName`, `lastName`, `email`, `phoneNumber`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `postalCode`, `shippingMethod`, `trackingUrl`, `estimatedDelivery`, `actualDelivery`) VALUES
(3, 3, 'John', 'Doe', 'john@example.com', '1234567890', '123 Main St', NULL, 'New York', 'NY', 'USA', '10001', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `firstName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `postalCode` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `lastLogin` datetime(3) DEFAULT NULL,
  `addressLine2` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `firstName`, `lastName`, `phoneNumber`, `address`, `city`, `state`, `country`, `postalCode`, `createdAt`, `updatedAt`, `isActive`, `lastLogin`, `addressLine2`) VALUES
(9, 'john_doe', 'john@example.com', '$2b$10$QXd2b6V5VPgvdWw0VZHLWerBnMqoBcHy7d/a3YoIStehyxaKnaK6m', 'John', 'Doe', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-24 15:30:33.798', '2025-06-24 15:30:33.798', 1, NULL, NULL),
(10, 'jane_smith', 'jane@example.com', '$2b$10$QXd2b6V5VPgvdWw0VZHLWerBnMqoBcHy7d/a3YoIStehyxaKnaK6m', 'Jane', 'Smith', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-24 15:30:33.805', '2025-06-24 15:30:33.805', 1, NULL, NULL),
(11, 'ggdharan02', 'ggdharan02@gmail.com', '$2b$10$Vyglbk4.1SMyAQEfYlKXVOUyhJQtB2cvP/8HplQk7P8DzSe8aetEi', 'Gangadharan', 'M', '+919940065254', 'no 9, thirupathi nagar ,mangadu, chennai-600122', 'Chennai, Tamil Nadu 600122', 'Tamil Nadu', 'India', '600122', '2025-06-24 15:47:31.407', '2025-06-24 15:47:31.407', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `addedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1dcd5201-a1fa-402d-a6be-0a37f5cfa6a7', '5562060788ed41ee789fbf283f9beb5c36a8c0f76d9313f0e7b422af02f7eddb', '2025-06-14 11:01:57.098', '20250430164847_fix_shipping_address_relation', NULL, NULL, '2025-06-14 11:01:56.991', 1),
('9a31e4bd-cd1c-4b52-9ccf-79e71e8b91ef', '545b9e88022f8e6190717d6ada0b7ada639d2f879d4fda9a22aafbf035e5d17e', '2025-06-14 11:01:56.987', '20250420151808_init', NULL, NULL, '2025-06-14 11:01:55.886', 1),
('ce4f6a6f-5a56-4b79-a9ea-f77bd9e6bfdb', '68bdf050feca52e9b53272f48624ff28d32dc9442e240cf95e4b5e5f6cedfae2', '2025-06-23 16:28:54.388', '20250623162853_add_product_fields', NULL, NULL, '2025-06-23 16:28:54.377', 1),
('f71638d5-40f5-42c6-a1bd-27f276fc7512', '8d714b01f58e3ea76130b7b37e437df4300438b9f10fc0a7678300ea00d681c3', '2025-06-27 15:24:17.162', '20250627152416_add_refund_reason_to_order', NULL, NULL, '2025-06-27 15:24:17.152', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Admin_username_key` (`username`),
  ADD UNIQUE KEY `Admin_email_key` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Cart_userId_productId_key` (`userId`,`productId`),
  ADD KEY `Cart_productId_fkey` (`productId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Category_parentId_fkey` (`parentId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_shippingAddressId_key` (`shippingAddressId`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payment_orderId_fkey` (`orderId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_sku_key` (`sku`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_userId_fkey` (`userId`),
  ADD KEY `Review_productId_fkey` (`productId`);

--
-- Indexes for table `shippingdetail`
--
ALTER TABLE `shippingdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ShippingDetail_orderId_fkey` (`orderId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wishlist_userId_productId_key` (`userId`,`productId`),
  ADD KEY `Wishlist_productId_fkey` (`productId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shippingdetail`
--
ALTER TABLE `shippingdetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `Cart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_shippingAddressId_fkey` FOREIGN KEY (`shippingAddressId`) REFERENCES `shippingdetail` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `shippingdetail`
--
ALTER TABLE `shippingdetail`
  ADD CONSTRAINT `ShippingDetail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
