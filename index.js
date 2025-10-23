import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/users/register', async (req, res) => {
  const { name } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const existingUserResult = await pool.query('SELECT id, name FROM users WHERE name = $1', [name]);
    const existingUser = existingUserResult.rows[0];
    
    if (existingUser) {
      return res.json({ 
        userId: existingUser.id, 
        name: existingUser.name,
        existing: true 
      });
    }

    const insertResult = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING id, name', [name]);
    const newUser = insertResult.rows[0];
    
    res.json({ 
      userId: newUser.id, 
      name: newUser.name,
      existing: false 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/users/progress', async (req, res) => {
  const { userId, day, checked, journalEntry } = req.body;

  if (!userId || !day) {
    return res.status(400).json({ error: 'userId and day are required' });
  }

  try {
    await pool.query(`
      INSERT INTO user_progress (user_id, day, checked, journal_entry, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, day) 
      DO UPDATE SET 
        checked = EXCLUDED.checked,
        journal_entry = EXCLUDED.journal_entry,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, day, checked, journalEntry || null]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/users/:userId/progress', async (req, res) => {
  const { userId } = req.params;

  try {
    const progressResult = await pool.query(`
      SELECT day, checked, journal_entry 
      FROM user_progress 
      WHERE user_id = $1 AND checked = TRUE
      ORDER BY day
    `, [userId]);
    const progress = progressResult.rows;

    const checkedDays = {};
    const journalEntries = {};

    progress.forEach(p => {
      checkedDays[p.day] = p.checked; // checked is already boolean
      if (p.journal_entry) {
        journalEntries[p.day] = p.journal_entry;
      }
    });

    res.json({ checkedDays, journalEntries });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboardResult = await pool.query(`
      WITH user_stats AS (
        SELECT 
          u.id,
          u.name,
          COUNT(CASE WHEN up.checked = TRUE THEN 1 END) as total_days,
          (
            SELECT COALESCE(MAX(streak_count), 0)
            FROM (
              SELECT 
                COUNT(*) as streak_count
              FROM (
                SELECT 
                  day,
                  day - ROW_NUMBER() OVER (ORDER BY day) as grp
                FROM user_progress
                WHERE user_id = u.id AND checked = TRUE
              ) AS sub_grp
              GROUP BY grp
            ) AS streak_counts
          ) as current_streak
        FROM users u
        LEFT JOIN user_progress up ON u.id = up.user_id
        GROUP BY u.id, u.name
      )
      SELECT 
        name,
        COALESCE(current_streak, 0) as streak
      FROM user_stats
      WHERE current_streak > 0
      ORDER BY current_streak DESC, name ASC
      LIMIT 50
    `);
    const leaderboard = leaderboardResult.rows;

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.post('/api/share', async (req, res) => {
  const { userId, userName, streak, daysSucceeded, shareData } = req.body;

  if (!userId || !userName) {
    return res.status(400).json({ error: 'userId and userName are required' });
  }

  try {
    const shareId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    await pool.query(`
      INSERT INTO shared_progress (id, user_id, user_name, streak, days_succeeded, share_data)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [shareId, userId, userName, streak || 0, daysSucceeded || 0, shareData || null]);

    const shareUrl = `${req.protocol}://${req.get('host')}/share/${shareId}`;
    
    res.json({ shareId, shareUrl });
  } catch (error) {
    console.error('Error creating share:', error);
    res.status(500).json({ error: 'Failed to create share' });
  }
});

app.get('/api/share/:shareId', async (req, res) => {
  const { shareId } = req.params;

  try {
    const shareResult = await pool.query(`
      SELECT user_name, streak, days_succeeded, share_data, created_at
      FROM shared_progress
      WHERE id = $1
    `, [shareId]);
    const share = shareResult.rows[0];

    if (!share) {
      return res.status(404).json({ error: 'Share not found' });
    }

    res.json({
      userName: share.user_name,
      streak: share.streak,
      daysSucceeded: share.days_succeeded,
      shareData: share.share_data || {},
      createdAt: share.created_at
    });
  } catch (error) {
    console.error('Error fetching share:', error);
    res.status(500).json({ error: 'Failed to fetch share' });
  }
});

if (!process.env.NETLIFY_LOCAL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Database: PostgreSQL (Neon)`);
  });
}

export default app;
