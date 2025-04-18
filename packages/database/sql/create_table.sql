-- CreateTable
CREATE TABLE IF NOT EXISTS `financial_history` (
    `code` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `volume` DOUBLE NULL,
    `open` DOUBLE NULL,
    `high` DOUBLE NULL,
    `low` DOUBLE NULL,
    `close` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `idx_code_timestamp`(`code`, `timestamp`),
    PRIMARY KEY (`code`, `timestamp`),
    UNIQUE KEY `unique_code_timestamp` (`code`, `timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `security` (
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,  -- 类型 "Fund" "Stock" "Index"
    `issue_date` DATETIME(3) NULL,
    `source` VARCHAR(191) NULL,  -- 来源 "长赢指数投资" ...
    `is_favorite` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `security_code_key`(`code`),
    INDEX `idx_code`(`code`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,  -- 股票代码
    `timestamp` DATETIME(3) NOT NULL,  -- 成交时间
    `type` VARCHAR(191) NOT NULL,  -- 成交类型
    `price` DOUBLE NULL,  -- 成交价
    `volume` DOUBLE NULL,  -- 成交量
    `profit` DOUBLE NULL,  -- 收益
    `profit_rate` DOUBLE NULL,  -- 收益率
    `source` VARCHAR(191) NULL,  -- 来源 
    `is_host` BOOLEAN NOT NULL DEFAULT FALSE,  -- 主理人操作
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

