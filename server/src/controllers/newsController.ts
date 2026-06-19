import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { pool } from '../db/pool';
import { NEWS_CATEGORIES } from '../types';

const createNewsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  body: z.string().min(10, 'Body must be at least 10 characters.'),
  category: z.enum(NEWS_CATEGORIES, {
    errorMap: () => ({ message: 'Choose a valid category.' }),
  }),
});

function imageUrl(req: Request, imagePath: string | null): string | null {
  if (!imagePath) return null;
  return `${req.protocol}://${req.get('host')}/uploads/news/${imagePath}`;
}

function serializeArticle(req: Request, row: any) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    imageUrl: imageUrl(req, row.image_path),
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createNews(req: Request, res: Response) {
  const parsed = createNewsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const { title, body, category } = parsed.data;
  const imagePath = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO news (title, body, category, image_path, author_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, body, category, imagePath, req.user!.userId]
    );

    const article = result.rows[0];
    const authorResult = await pool.query('SELECT name FROM users WHERE id = $1', [
      req.user!.userId,
    ]);
    article.author_name = authorResult.rows[0]?.name || 'Unknown';

    return res.status(201).json({ article: serializeArticle(req, article) });
  } catch (err) {
    console.error('Create news error:', err);
    return res.status(500).json({ message: 'Something went wrong while publishing the article.' });
  }
}

export async function listNews(req: Request, res: Response) {
  const { category, mine } = req.query;

  try {
    const conditions: string[] = [];
    const params: any[] = [];

    if (category && typeof category === 'string') {
      params.push(category);
      conditions.push(`n.category = $${params.length}`);
    }

    if (mine === 'true' && req.user) {
      params.push(req.user.userId);
      conditions.push(`n.author_id = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT n.*, u.name AS author_name
       FROM news n
       JOIN users u ON u.id = n.author_id
       ${where}
       ORDER BY n.created_at DESC`,
      params
    );

    return res.json({ articles: result.rows.map((row) => serializeArticle(req, row)) });
  } catch (err) {
    console.error('List news error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching news.' });
  }
}

export async function getNewsById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT n.*, u.name AS author_name
       FROM news n
       JOIN users u ON u.id = n.author_id
       WHERE n.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    return res.json({ article: serializeArticle(req, result.rows[0]) });
  } catch (err) {
    console.error('Get news error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching the article.' });
  }
}

export async function deleteNews(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    const article = existing.rows[0];

    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    // Reporters may only delete their own articles; admins can delete any.
    if (req.user!.role !== 'admin' && article.author_id !== req.user!.userId) {
      return res.status(403).json({ message: 'You can only delete your own articles.' });
    }

    await pool.query('DELETE FROM news WHERE id = $1', [id]);

    if (article.image_path) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', 'news', article.image_path);
      fs.unlink(filePath, () => {
        /* ignore errors removing the file */
      });
    }

    return res.json({ message: 'Article deleted.' });
  } catch (err) {
    console.error('Delete news error:', err);
    return res.status(500).json({ message: 'Something went wrong while deleting the article.' });
  }
}

export async function getCategories(_req: Request, res: Response) {
  return res.json({ categories: NEWS_CATEGORIES });
}
