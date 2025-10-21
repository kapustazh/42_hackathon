-- Create the users table to store authenticated 42 students
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    forty_two_id INT UNIQUE NOT NULL, -- The user's unique ID from the 42 API
    username VARCHAR(50) UNIQUE NOT NULL, -- The user's intra login name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the ideas table for anonymous posts
CREATE TABLE ideas (
    id SERIAL PRIMARY KEY,
    -- This links to the author but is kept secret by the back-end
    user_id INT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    -- Fields for the locking mechanism
    is_locked BOOLEAN DEFAULT FALSE,
    locked_by_id INT NULL REFERENCES users(id), -- Who locked it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the votes table to track user actions
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    idea_id INT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    vote_type INT NOT NULL, -- e.g., 1 for upvote, -1 for downvote, 0 for spam
    -- Ensures a user can only vote once per idea
    UNIQUE(user_id, idea_id)
);