# 微博用户数据采集

二级市场捡辣鸡冠军(7519797263)、ETF拯救世界(5687069307) 微博数据采集


## 基于实现

- SQLite
- NodeJS
- 微博 API

## 环境变量

```bash
COOKIE=""
X_XSRF_TOKEN=""

USER_IDS="7519797263" # 5687069307
DATABASE_URL="./weibo.db" # 数据库文件
SLEEP_TIME=1000       # 每页数据采集后等待时间
```

## 启动

```bash
yarn install
yarn dev
```

## 数据库表结构

```sql
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    time INTEGER NOT NULL,
    ref_text TEXT,
    ref_link TEXT,
    pic_ids TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

