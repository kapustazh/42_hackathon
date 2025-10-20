import unittest
import requests
import psycopg2
import json

# --- Configuration ---
# The base URL of your running back-end server
API_URL = "http://localhost:3000/api"

# !! IMPORTANT !!: Fill in your TEST database details here.
DB_CONFIG = {
    "user": "postgres",
    "password": "20102025", # Use the password you set for the postgres user
    "host": "localhost",
    "port": "5432",
    "database": "whiteboard_db" # Use the database you created
}

class TestWhiteboardAPI(unittest.TestCase):

    def setUp(self):
        """
        Runs before each test. It connects to the database and clears all tables
        to ensure each test starts from a clean, predictable state.
        """
        self.conn = psycopg2.connect(**DB_CONFIG)
        with self.conn.cursor() as cur:
            # Clear tables in order to respect foreign key constraints
            cur.execute("TRUNCATE TABLE votes, ideas, users RESTART IDENTITY CASCADE;")
            # Add a dummy user for tests that require authentication
            cur.execute("INSERT INTO users (forty_two_id, username) VALUES (%s, %s);", (1, 'testuser'))
        self.conn.commit()

    def tearDown(self):
        """Runs after each test to close the database connection."""
        self.conn.close()

    def test_1_get_ideas_when_empty(self):
        """Test fetching ideas when there are none in the database."""
        response = requests.get(f"{API_URL}/ideas")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), []) # Should return an empty list

    def test_2_create_idea_successfully(self):
        """Test creating a new idea with valid data."""
        payload = {"content": "This is a new idea.", "userId": 1}
        response = requests.post(f"{API_URL}/ideas", json=payload)

        # 1. Check the API response
        self.assertEqual(response.status_code, 201) # 201 means "Created"
        data = response.json()
        self.assertEqual(data['content'], "This is a new idea.")
        self.assertNotIn('user_id', data) # Verify author anonymity

        # 2. Check the database to confirm it was saved correctly
        with self.conn.cursor() as cur:
            cur.execute("SELECT content, user_id FROM ideas WHERE id = %s;", (data['id'],))
            record = cur.fetchone()
            self.assertIsNotNone(record)
            self.assertEqual(record[0], "This is a new idea.")
            self.assertEqual(record[1], 1) # Check link to author

    def test_3_create_idea_fails_with_no_content(self):
        """Test that the API rejects an idea with empty content."""
        payload = {"content": "", "userId": 1}
        response = requests.post(f"{API_URL}/ideas", json=payload)
        self.assertEqual(response.status_code, 400) # 400 means "Bad Request"

    def test_4_lock_idea_successfully(self):
        """Test locking an existing, unlocked idea."""
        # First, create an idea in the database to lock
        with self.conn.cursor() as cur:
            cur.execute("INSERT INTO ideas (user_id, content) VALUES (%s, %s) RETURNING id;", (1, 'An idea to lock'))
            idea_id = cur.fetchone()[0]
        self.conn.commit()

        # Now, send a request to the lock endpoint
        payload = {"userId": 1}
        response = requests.post(f"{API_URL}/ideas/{idea_id}/lock", json=payload)

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['is_locked'])
        self.assertEqual(data['locked_by_id'], 1)

    def test_5_lock_idea_fails_if_already_locked(self):
        """Test that the API prevents locking an already locked idea."""
        # Create an already-locked idea in the database
        with self.conn.cursor() as cur:
            cur.execute("INSERT INTO ideas (user_id, content, is_locked, locked_by_id) VALUES (%s, %s, TRUE, %s) RETURNING id;", (1, 'A locked idea', 1))
            idea_id = cur.fetchone()[0]
        self.conn.commit()

        # Try to lock it again
        payload = {"userId": 1}
        response = requests.post(f"{API_URL}/ideas/{idea_id}/lock", json=payload)
        self.assertEqual(response.status_code, 409) # 409 means "Conflict"


if __name__ == '__main__':
    unittest.main()
