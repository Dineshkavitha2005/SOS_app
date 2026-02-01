-- SafeNet User Database Schema (SQLite)
-- Stores login, signup, and emergency information for users

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    age INTEGER,
    blood_group TEXT,
    medical_conditions TEXT, -- Comma-separated or JSON string
    emergency_contacts TEXT, -- JSON string array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example for storing emergency_contacts as JSON:
-- ["+1234567890", "+1987654321"]
