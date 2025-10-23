import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/users/register', (req, res) => {
  const { name } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE name = ?').get(name);
    
    if (existingUser) {
      return res.json({ 
        userId: existingUser.id, 
        name: existingUser.name,
        existing: true 
      });
    }

    const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(name);
    
    res.json({ 
      userId: result.lastInsertRowid, 
      name,
      existing: false 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/users/progress', (req, res) => {
  const { userId, day, checked, journalEntry } = req.body;

  if (!userId || !day) {
    return res.status(400).json({ error: 'userId and day are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO user_progress (user_id, day, checked, journal_entry, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, day) 
      DO UPDATE SET 
        checked = excluded.checked,
        journal_entry = excluded.journal_entry,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, day, checked ? 1 : 0, journalEntry || null);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/users/:userId/progress', (req, res) => {
  const { userId } = req.params;

  try {
    const progress = db.prepare(`
      SELECT day, checked, journal_entry 
      FROM user_progress 
      WHERE user_id = ? AND checked = 1
      ORDER BY day
    `).all(userId);

    const checkedDays = {};
    const journalEntries = {};

    progress.forEach(p => {
      checkedDays[p.day] = p.checked === 1;
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

app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = db.prepare(`
      WITH user_stats AS (
        SELECT 
          u.id,
          u.name,
          COUNT(CASE WHEN up.checked = 1 THEN 1 END) as total_days,
          (
            SELECT MAX(streak_count)
            FROM (
              SELECT 
                COUNT(*) as streak_count
              FROM (
                SELECT 
                  day,
                  day - ROW_NUMBER() OVER (ORDER BY day) as grp
                FROM user_progress
                WHERE user_id = u.id AND checked = 1
              )
              GROUP BY grp
            )
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
    `).all();

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.post('/api/share', (req, res) => {
  const { userId, userName, streak, daysSucceeded, shareData } = req.body;

  if (!userId || !userName) {
    return res.status(400).json({ error: 'userId and userName are required' });
  }

  try {
    const shareId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    db.prepare(`
      INSERT INTO shared_progress (id, user_id, user_name, streak, days_succeeded, share_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(shareId, userId, userName, streak || 0, daysSucceeded || 0, JSON.stringify(shareData || {}));

    const shareUrl = `${req.protocol}://${req.get('host')}/share/${shareId}`;
    
    res.json({ shareId, shareUrl });
  } catch (error) {
    console.error('Error creating share:', error);
    res.status(500).json({ error: 'Failed to create share' });
  }
});

app.get('/api/share/:shareId', (req, res) => {
  const { shareId } = req.params;

  try {
    const share = db.prepare(`
      SELECT user_name, streak, days_succeeded, share_data, created_at
      FROM shared_progress
      WHERE id = ?
    `).get(shareId);

    if (!share) {
      return res.status(404).json({ error: 'Share not found' });
    }

    res.json({
      userName: share.user_name,
      streak: share.streak,
      daysSucceeded: share.days_succeeded,
      shareData: share.share_data ? JSON.parse(share.share_data) : {},
      createdAt: share.created_at
    });
  } catch (error) {
    console.error('Error fetching share:', error);
    res.status(500).json({ error: 'Failed to fetch share' });
  }
});

if (!process.env.NETLIFY) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Database: ${path.join(__dirname, 'nnn-tracker.db')}`);
  });
}

export default app;
