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
