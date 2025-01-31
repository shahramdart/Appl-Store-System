-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 31, 2025 at 10:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mobile-ranya`
--

-- --------------------------------------------------------

--
-- Table structure for table `archives`
--

CREATE TABLE `archives` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  `product_qty` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `archives`
--

INSERT INTO `archives` (`id`, `product_name`, `product_price`, `product_qty`, `description`, `category_id`, `brand_id`, `createdAt`, `updatedAt`) VALUES
(122, NULL, NULL, 1, NULL, 2, 5, '2025-01-31 17:56:17', '2025-01-31 17:56:17'),
(123, NULL, NULL, 1, NULL, 2, 5, '2025-01-31 20:56:47', '2025-01-31 20:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `brand_name`, `user_id`, `createdAt`, `updatedAt`) VALUES
(5, 'ئەپڵ', 2, '2024-12-25 15:31:10', '0000-00-00 00:00:00'),
(6, 'سامسۆنگ', 2, '2024-12-25 15:31:10', '0000-00-00 00:00:00'),
(7, 'شاومی', 2, '2024-12-25 15:31:10', '2024-12-20 14:56:31');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `user_id`, `createdAt`, `updatedAt`) VALUES
(2, 'Mobile', 2, '2024-12-04 20:31:08', '2024-12-04 20:31:08'),
(3, 'adapter', 2, '2024-12-04 20:31:21', '2024-12-04 20:31:21'),
(4, 'cable', 2, '2024-12-04 20:31:34', '2024-12-04 20:31:34'),
(5, 'case', 2, '2024-12-04 20:31:51', '2024-12-04 20:31:51'),
(6, 'glass screen', 2, '2024-12-04 20:32:03', '2024-12-04 20:32:03'),
(7, 'Tablet', 2, '2024-12-07 18:46:10', '2024-12-07 18:46:10');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `total_purchase` decimal(10,2) DEFAULT 0.00,
  `purchase_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `total_purchase`, `purchase_price`, `quantity`, `category_id`, `product_id`, `createdAt`, `updatedAt`, `user_id`) VALUES
(65, 12000.00, 1200.00, 10, 2, 119, '2025-01-31 15:09:15', '2025-01-31 15:09:15', 2),
(69, 890.00, 890.00, 1, 2, 123, '2025-01-31 18:35:40', '2025-01-31 18:35:40', 2);

-- --------------------------------------------------------

--
-- Table structure for table `installment_sales`
--

CREATE TABLE `installment_sales` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `paray_zyada` decimal(10,2) DEFAULT NULL,
  `peshaky_payment` decimal(10,2) NOT NULL,
  `paray_mawa` decimal(10,2) DEFAULT NULL,
  `qty_qist` decimal(10,2) NOT NULL,
  `total_qistakan` int(11) NOT NULL,
  `qisty_mawa` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `final_date` datetime NOT NULL,
  `status` enum('هەڵپەسێردراو','پارەی دا','دواکەوتووە') DEFAULT 'هەڵپەسێردراو',
  `customer_name` varchar(64) NOT NULL,
  `customer_phoneNo` varchar(24) NOT NULL,
  `customer_address` varchar(128) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `installment_sales`
--

INSERT INTO `installment_sales` (`id`, `product_id`, `user_id`, `product_price`, `quantity`, `total_price`, `paray_zyada`, `peshaky_payment`, `paray_mawa`, `qty_qist`, `total_qistakan`, `qisty_mawa`, `date`, `final_date`, `status`, `customer_name`, `customer_phoneNo`, `customer_address`, `createdAt`, `updatedAt`) VALUES
(6, 119, 2, 1200.00, 1, 1300.00, 100.00, 500.00, 800.00, 100.00, 9, 9, '2025-02-01 00:00:00', '2025-11-01 00:00:00', 'هەڵپەسێردراو', 'Shahram Othman', '+9647507145127', '', '2025-01-31 19:25:51', '2025-01-31 19:25:51');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_quantity` int(11) NOT NULL,
  `invoice_pirce` decimal(10,2) NOT NULL,
  `invoice_total_pirce` decimal(10,2) NOT NULL,
  `invoice_status` enum('کاش','مانگانە') NOT NULL,
  `invoice_date` datetime NOT NULL,
  `invoice_customer` varchar(64) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_quantity`, `invoice_pirce`, `invoice_total_pirce`, `invoice_status`, `invoice_date`, `invoice_customer`, `user_id`, `product_id`, `createdAt`, `updatedAt`) VALUES
(40, 1, 1215.00, 1215.00, 'کاش', '2025-01-31 00:00:00', 'Walk-in', 2, 119, '2025-01-31 15:09:46', '2025-01-31 15:09:46'),
(48, 1, 1220.00, 1220.00, 'کاش', '2025-01-31 00:00:00', 'Walk-in', 2, 119, '2025-01-31 17:50:23', '2025-01-31 17:50:23'),
(50, 1, 1220.00, 1220.00, 'کاش', '2025-01-31 00:00:00', 'Walk-in', 2, 119, '2025-01-31 17:53:49', '2025-01-31 17:53:49'),
(54, 1, 1220.00, 1220.00, 'کاش', '2025-01-31 00:00:00', 'شەهرام عثمان', 2, 119, '2025-01-31 18:21:50', '2025-01-31 18:21:50'),
(55, 1, 1220.00, 1220.00, 'کاش', '2025-01-31 00:00:00', 'شەهرام عثمان', 2, 119, '2025-01-31 18:23:11', '2025-01-31 18:23:11'),
(57, 1, 1220.00, 1220.00, 'کاش', '2025-01-31 00:00:00', 'Walk-in', 2, 119, '2025-01-31 18:47:30', '2025-01-31 18:47:30'),
(58, 1, 900.00, 900.00, 'کاش', '2025-01-31 00:00:00', 'فەرەیدون', 2, 123, '2025-01-31 20:56:47', '2025-01-31 20:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `permissions` enum('Admin','Seller') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `permissions`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '2024-11-09 16:20:26', '2024-11-09 16:20:26'),
(2, 'Seller', '2024-11-09 16:20:26', '2024-11-09 16:20:26');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_color` varchar(100) DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  `product_qty` int(11) NOT NULL,
  `product_qrcode` bigint(20) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `product_color`, `product_price`, `product_qty`, `product_qrcode`, `category_id`, `brand_id`, `user_id`, `createdAt`, `updatedAt`) VALUES
(119, 'iphone 16 pro max', 'Titanium', 1200.00, 4, 202405231791, 2, 5, 2, '2025-01-31 15:09:15', '2025-01-31 18:47:30'),
(123, 'iphone 14 pro max', 'Purple ', 890.00, 0, 352680943746050, 2, 5, 2, '2025-01-31 18:35:40', '2025-01-31 20:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_price` decimal(10,2) NOT NULL,
  `profit_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sale_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `product_id`, `quantity`, `price`, `total_price`, `profit_amount`, `discount`, `category_id`, `brand_id`, `user_id`, `createdAt`, `updatedAt`, `sale_date`) VALUES
(35, 119, 1, 1215.00, 1215.00, 15.00, 0.00, 2, 5, 2, '2025-01-31 15:09:46', '2025-01-31 15:09:46', '2025-01-31 00:00:00'),
(38, 119, 1, 1220.00, 1220.00, 20.00, 0.00, 2, 5, 2, '2025-01-31 17:50:23', '2025-01-31 17:50:23', '2025-01-31 00:00:00'),
(40, 119, 1, 1220.00, 1220.00, 20.00, 0.00, 2, 5, 2, '2025-01-31 17:53:49', '2025-01-31 17:53:49', '2025-01-31 00:00:00'),
(42, 119, 1, 1220.00, 1220.00, 20.00, 0.00, 2, 5, 2, '2025-01-31 18:21:50', '2025-01-31 18:21:50', '2025-01-31 00:00:00'),
(43, 119, 1, 1220.00, 1220.00, 20.00, 0.00, 2, 5, 2, '2025-01-31 18:23:11', '2025-01-31 18:23:11', '2025-01-31 00:00:00'),
(44, 119, 1, 1220.00, 1220.00, 20.00, 0.00, 2, 5, 2, '2025-01-31 18:47:30', '2025-01-31 18:47:30', '2025-01-31 00:00:00'),
(45, 123, 1, 900.00, 900.00, 10.00, 0.00, 2, 5, 2, '2025-01-31 20:56:47', '2025-01-31 20:56:47', '2025-01-31 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `sallings`
--

CREATE TABLE `sallings` (
  `id` int(11) NOT NULL,
  `salling_date` datetime NOT NULL,
  `salling_quantity` int(11) DEFAULT NULL,
  `salling_price` float DEFAULT NULL,
  `salling_discount` float NOT NULL,
  `price_after_discount` decimal(10,2) NOT NULL,
  `salling_total_price` decimal(10,2) NOT NULL,
  `salling_description` text DEFAULT NULL,
  `salling_status` enum('کاش','قیست') NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sallings`
--

INSERT INTO `sallings` (`id`, `salling_date`, `salling_quantity`, `salling_price`, `salling_discount`, `price_after_discount`, `salling_total_price`, `salling_description`, `salling_status`, `product_id`, `category_id`, `brand_id`, `user_id`, `createdAt`, `updatedAt`) VALUES
(37, '2025-01-31 00:00:00', 1, 1215, 0, 1215.00, 1215.00, '', 'کاش', 119, 2, 5, 2, '2025-01-31 15:09:46', '2025-01-31 15:09:46'),
(45, '2025-01-31 00:00:00', 1, 1220, 0, 1220.00, 1220.00, '', 'کاش', 119, 2, 5, 2, '2025-01-31 17:50:23', '2025-01-31 17:50:23'),
(47, '2025-01-31 00:00:00', 1, 1220, 0, 1220.00, 1220.00, '', 'کاش', 119, 2, 5, 2, '2025-01-31 17:53:49', '2025-01-31 17:53:49'),
(51, '2025-01-31 00:00:00', 1, 1220, 0, 1220.00, 1220.00, '', 'کاش', 119, 2, 5, 2, '2025-01-31 18:21:50', '2025-01-31 18:21:50'),
(52, '2025-01-31 00:00:00', 1, 1220, 0, 1220.00, 1220.00, '', 'کاش', 119, 2, 5, 2, '2025-01-31 18:23:11', '2025-01-31 18:23:11'),
(54, '2025-01-31 00:00:00', 1, 1220, 0, 1220.00, 1220.00, '', 'کاش', 119, 2, 5, 2, '2025-01-31 18:47:30', '2025-01-31 18:47:30'),
(55, '2025-01-31 00:00:00', 1, 900, 0, 900.00, 900.00, '', 'کاش', 123, 2, 5, 2, '2025-01-31 20:56:47', '2025-01-31 20:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `Sessions`
--

CREATE TABLE `Sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Sessions`
--

INSERT INTO `Sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('8-ttFvCazqFDs7qbuQZENm58n56NR_Pd', '2025-02-01 21:47:53', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":2}', '2025-01-31 19:17:59', '2025-01-31 21:47:53'),
('T29F-3RzwTSF1nz2Ugmz8MyFOYUHaHh0', '2025-02-01 21:07:40', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":2}', '2025-01-31 19:21:13', '2025-01-31 21:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  `permission_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `user_phone`, `permission_id`, `createdAt`, `updatedAt`) VALUES
(2, 'Sinan Aras Yilmaz', 'sinan@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$kFgMRbfU8kBZJKERFMYq4Q$REKXvRDv+a8PIZlJHPxDcUvkiiBMW5kuyASMknNSxGY', '12343215432123', 1, '2024-11-09 15:25:44', '2024-11-09 15:25:44'),
(8, 'Bavel Majid', 'bavel@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$yiRkUgaKgS/7ilrsfUeL3Q$b24+dxcAfNwKFclEMxetlr7pl5HH9jYL633KasiKra8', '11223344', 2, '2024-12-17 11:51:41', '2024-12-17 11:51:41'),
(9, 'فەرەیدون محمد', 'faraidun@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$o7wRG6hQzu+Pd1G6G3LNOQ$YM7+VlRB9iKCmI7c9HVv+xzkc+C5bTpn4/9N9gpKNp4', '07707704648', 1, '2025-01-30 17:19:58', '2025-01-30 17:19:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `archives`
--
ALTER TABLE `archives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category` (`category_id`),
  ADD KEY `fk_brand` (`brand_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brand_name` (`brand_name`),
  ADD UNIQUE KEY `brand_name_2` (`brand_name`),
  ADD UNIQUE KEY `brand_name_3` (`brand_name`),
  ADD UNIQUE KEY `brand_name_4` (`brand_name`),
  ADD UNIQUE KEY `brand_name_5` (`brand_name`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_name` (`category_name`),
  ADD UNIQUE KEY `category_name_2` (`category_name`),
  ADD UNIQUE KEY `category_name_3` (`category_name`),
  ADD UNIQUE KEY `category_name_4` (`category_name`),
  ADD UNIQUE KEY `category_name_5` (`category_name`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `productId` (`product_id`),
  ADD KEY `FK_Expenses_Category` (`category_id`);

--
-- Indexes for table `installment_sales`
--
ALTER TABLE `installment_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `installment_sales_ibfk_1` (`product_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoices_ibfk_1` (`user_id`),
  ADD KEY `invoices_ibfk_2` (`product_id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_qrcode` (`product_qrcode`),
  ADD UNIQUE KEY `product_qrcode_2` (`product_qrcode`),
  ADD UNIQUE KEY `product_qrcode_3` (`product_qrcode`),
  ADD UNIQUE KEY `product_qrcode_4` (`product_qrcode`),
  ADD UNIQUE KEY `product_qrcode_5` (`product_qrcode`),
  ADD UNIQUE KEY `product_qrcode_6` (`product_qrcode`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `products_ibfk_16` (`user_id`),
  ADD KEY `products_ibfk_17` (`brand_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_User` (`user_id`),
  ADD KEY `FK_Sales_Category` (`category_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `sales_ibfk_2` (`brand_id`);

--
-- Indexes for table `sallings`
--
ALTER TABLE `sallings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `sallings_ibfk_1` (`product_id`);

--
-- Indexes for table `Sessions`
--
ALTER TABLE `Sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `installment_sales`
--
ALTER TABLE `installment_sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `sallings`
--
ALTER TABLE `sallings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `archives`
--
ALTER TABLE `archives`
  ADD CONSTRAINT `fk_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productId` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `installment_sales`
--
ALTER TABLE `installment_sales`
  ADD CONSTRAINT `installment_sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `installment_sales_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_13` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_17` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `FK_User` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sallings`
--
ALTER TABLE `sallings`
  ADD CONSTRAINT `sallings_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `sallings_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `sallings_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `sallings_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
