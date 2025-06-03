CREATE TABLE IF NOT EXISTS weibo_posts (
    id VARCHAR(32) PRIMARY KEY COMMENT '微博帖子ID',
    blog_id VARCHAR(32) NOT NULL COMMENT '微博帖子ID',
    user_id VARCHAR(32) NOT NULL COMMENT '发帖用户ID',
    text TEXT NOT NULL COMMENT '帖子内容',
    time DATE NOT NULL COMMENT '发帖时间',
    ref_text TEXT COMMENT '转发内容',
    ref_link VARCHAR(255) COMMENT '转发链接',
    pic_ids TEXT COMMENT '图片ID列表,JSON格式',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '数据入库时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '数据更新时间',

    INDEX idx_post_id (blog_id) COMMENT '帖子ID索引',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_time (time) COMMENT '时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT '微博数据';



CREATE TABLE IF NOT EXISTS weibo_users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT COMMENT '自增主键',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    user_name VARCHAR(255) NOT NULL DEFAULT '' COMMENT '用户名',
    user_avatar VARCHAR(255) NOT NULL DEFAULT '' COMMENT '用户头像',
    user_description TEXT COMMENT '用户描述',
    user_created_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户创建时间',
    first_blog_id VARCHAR(32) COMMENT '用户第一条微博ID',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '数据入库时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '数据更新时间',

    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_user_name (user_name) COMMENT '用户名索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT '微博用户数据';



CREATE TABLE IF NOT EXISTS security_info (
    symbol VARCHAR(32) PRIMARY KEY NOT NULL COMMENT '交易所+代码',
    exchange VARCHAR(32) NOT NULL COMMENT '交易所',
    code VARCHAR(32) NOT NULL COMMENT '代码',
    issue_date DATETIME NOT NULL COMMENT '上市日期',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '数据入库时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '数据更新时间',

    INDEX idx_code (code) COMMENT '股票代码索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT '证券数据';



CREATE TABLE IF NOT EXISTS security_history (
    symbol VARCHAR(32) NOT NULL COMMENT '交易所+代码',
    timestamp DATETIME NOT NULL COMMENT '时间戳',
    open DOUBLE NOT NULL COMMENT '开盘价',
    high DOUBLE NOT NULL COMMENT '最高价',
    low DOUBLE NOT NULL COMMENT '最低价',
    close DOUBLE NOT NULL COMMENT '收盘价',
    volume DOUBLE NOT NULL COMMENT '成交量',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '数据入库时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '数据更新时间',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT '证券历史数据';
