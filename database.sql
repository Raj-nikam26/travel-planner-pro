-- Create database
CREATE DATABASE IF NOT EXISTS travelplan_db;
USE travelplan_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id VARCHAR(50) UNIQUE NOT NULL,
    destination VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    budget VARCHAR(50) NOT NULL,
    travel_style VARCHAR(50) NOT NULL,
    traveler_type VARCHAR(50) NOT NULL,
    special_requirements TEXT,
    content TEXT NOT NULL,
    sources TEXT,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_user_trips ON trips(user_id);
CREATE INDEX idx_trip_id ON trips(trip_id);
