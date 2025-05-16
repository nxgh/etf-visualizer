CREATE TABLE IF NOT EXISTS weibo_posts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT COMMENT '自增主键',
    post_id VARCHAR(32) NOT NULL COMMENT '微博帖子ID',
    user_id VARCHAR(32) NOT NULL COMMENT '发帖用户ID',
    text TEXT NOT NULL COMMENT '帖子内容',
    time BIGINT NOT NULL COMMENT '发帖时间戳',
    ref_text TEXT COMMENT '转发内容',
    ref_link VARCHAR(255) COMMENT '转发链接',
    pic_ids TEXT COMMENT '图片ID列表,JSON格式',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '数据入库时间',
    INDEX idx_post_id (post_id) COMMENT '帖子ID索引',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_time (time) COMMENT '时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT '微博数据';
