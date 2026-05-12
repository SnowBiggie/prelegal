import os
import aiosqlite
from pathlib import Path

DB_PATH = Path(os.getenv("DB_PATH", "./prelegal.db"))


async def create_tables() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER  PRIMARY KEY AUTOINCREMENT,
                email      TEXT     NOT NULL UNIQUE,
                password   TEXT     NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()
