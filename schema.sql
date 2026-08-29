-- ==========================================================
-- GreenTrack AI: PostgreSQL / Supabase Relational Database Schema
-- ==========================================================

-- Enable PostGIS for GPS spatial queries if hosted on PostgreSQL/Supabase
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. GUILDS / CLANS TABLE (Colleges & Neighborhoods)
CREATE TABLE IF NOT EXISTS guilds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) DEFAULT 'College Campus', -- 'College Campus' | 'Neighborhood Colony'
    city VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '🏛️',
    badge VARCHAR(50) DEFAULT 'Active Clan',
    members_count INT DEFAULT 1,
    trees_tracked INT DEFAULT 0,
    survival_rate NUMERIC(5, 2) DEFAULT 100.0,
    total_co2_kg NUMERIC(10, 2) DEFAULT 0.0,
    squad_xp INT DEFAULT 0,
    rank INT DEFAULT 1,
    leader_name VARCHAR(100),
    motto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    total_xp INT DEFAULT 0,
    trees_planted_count INT DEFAULT 0,
    care_streak_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TREES TABLE (Physical & Digital Twin Records)
CREATE TABLE IF NOT EXISTS trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    species_id VARCHAR(50) NOT NULL,
    species_name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    category VARCHAR(50), -- 'Urban & Shade Tree' | 'Indoor Foliage' | 'Medicinal' | 'Fruit'
    date_planted DATE NOT NULL,
    planter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    geom GEOMETRY(Point, 4326), -- PostGIS point for spatial radius search
    height_meters NUMERIC(4, 2) DEFAULT 1.0,
    canopy_diameter_meters NUMERIC(4, 2) DEFAULT 0.5,
    health_score INT DEFAULT 95, -- 0 to 100%
    status VARCHAR(30) DEFAULT 'Healthy', -- 'Healthy' | 'Needs Attention' | 'Critical'
    co2_offset_kg NUMERIC(8, 2) DEFAULT 0.0,
    last_watered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_diagnosed_at TIMESTAMP WITH TIME ZONE,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TREE EVENTS & AI VERIFICATION LOGS
CREATE TABLE IF NOT EXISTS tree_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'Watering' | 'AI Health Scan' | 'Fertilizer' | 'Pruning'
    title VARCHAR(150) NOT NULL,
    note TEXT,
    health_status VARCHAR(30),
    health_score INT,
    disease_detected VARCHAR(100),
    image_url TEXT,
    ai_verified BOOLEAN DEFAULT FALSE,
    xp_awarded INT DEFAULT 15,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ACTIVE COMMUNITY QUESTS
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    target_count INT NOT NULL,
    current_progress INT DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'Trees',
    reward_xp INT DEFAULT 500,
    badge_reward VARCHAR(100),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample Spatial Query: Find all trees within 2km of a coordinate
-- SELECT * FROM trees 
-- WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)::geography, 2000);
