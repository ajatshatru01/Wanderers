-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

-- PACKAGES TABLE
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    name VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    slot INT NOT NULL,
    location VARCHAR(50) NOT NULL,
    duration INT NOT NULL
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_people INT NOT NULL
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    package_id INT REFERENCES packages(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT NOT NULL,
    UNIQUE (user_id, package_id)
);

-- STAFF TABLE (optional)
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL
);

-- DEFAULT ADMIN
INSERT INTO users (username, password, role)
VALUES ('admin', 'admin@123', 'admin')
ON CONFLICT (username) DO NOTHING;
