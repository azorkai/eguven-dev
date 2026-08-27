
import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await db.posts.find({}).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Create a post
router.post('/', async (req, res) => {
    const { title, content, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const newPost = await db.posts.insert({ title, content, tags: tags || [] });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const numRemoved = await db.posts.remove({ _id: req.params.id }, {});
        if (numRemoved === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

export default router;
