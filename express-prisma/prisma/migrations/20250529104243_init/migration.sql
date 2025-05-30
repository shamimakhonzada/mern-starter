-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `StaticD` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devID` VARCHAR(191) NULL,
    `hMAC` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `ssid` INTEGER NULL,
    `HmV` VARCHAR(191) NULL,
    `firmVer` DOUBLE NULL,
    `RF` INTEGER NULL,

    UNIQUE INDEX `StaticD_devID_key`(`devID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DynamicD` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batSoC` INTEGER NULL,
    `rssi` INTEGER NULL,
    `epoch` INTEGER NULL,
    `temp` DOUBLE NULL,
    `humi` INTEGER NULL,
    `co` INTEGER NULL,
    `pm25` INTEGER NULL,
    `staticDId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Node` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nMAC` VARCHAR(191) NULL,
    `nAddr` INTEGER NULL,
    `nRSSI` INTEGER NULL,
    `nT` INTEGER NULL,
    `nH` INTEGER NULL,
    `nBat` INTEGER NULL,
    `nEpoch` INTEGER NULL,
    `dynamicDId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DynamicD` ADD CONSTRAINT `DynamicD_staticDId_fkey` FOREIGN KEY (`staticDId`) REFERENCES `StaticD`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Node` ADD CONSTRAINT `Node_dynamicDId_fkey` FOREIGN KEY (`dynamicDId`) REFERENCES `DynamicD`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
