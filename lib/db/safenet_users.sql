-- SafeNet User Database Schema (SQLite)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    age INTEGER,
    blood_group TEXT,
    medical_conditions TEXT,
    emergency_contacts TEXT, -- JSON stringified array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For login, only email and password_hash are required.
-- For emergency info, age, blood_group, medical_conditions, and emergency_contacts are used.
