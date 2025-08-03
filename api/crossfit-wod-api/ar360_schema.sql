-- Esquema inicial para Alto Rendimiento 360 (SQLite compatible, fácil de migrar a PostgreSQL)
-- Archivo: ar360.db (usar este nombre para la base de datos)

-- Tabla de usuarios
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('entrenador', 'atleta')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de WODs
CREATE TABLE wods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    exercises TEXT, -- JSON o texto largo
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignaciones de WODs a usuarios
CREATE TABLE wod_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wod_id INTEGER REFERENCES wods(id),
    user_id INTEGER REFERENCES users(id),
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pendiente'
);

-- Tabla de records/progreso
CREATE TABLE records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    wod_id INTEGER REFERENCES wods(id),
    result TEXT NOT NULL,
    notes TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices útiles
CREATE INDEX idx_records_user ON records(user_id);
CREATE INDEX idx_records_wod ON records(wod_id);
