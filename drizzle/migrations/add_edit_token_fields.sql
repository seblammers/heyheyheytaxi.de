-- Migration: Add edit_token_hash and updated_at fields to posts table
-- Run this in Supabase SQL Editor

-- Add edit_token_hash column (nullable, for existing posts)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS edit_token_hash TEXT;

-- Add updated_at column (nullable timestamp)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Add comment for documentation
COMMENT ON COLUMN posts.edit_token_hash IS 'Bcrypt hash of the edit token for secure story editing';
COMMENT ON COLUMN posts.updated_at IS 'Timestamp when the post was last updated';

