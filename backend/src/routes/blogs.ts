import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all blogs
router.get('/', async (req: Request, res: Response) => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Get blog by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
        });
        if (!blog) {
            res.status(404).json({ error: 'Blog not found' });
            return;
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
});

// Create new blog
router.post('/', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newBlog = await prisma.blog.create({
            data: {
                title: data.title,
                content: data.content,
                author: data.author || 'Admin',
                images: data.images || [],
            }
        });
        res.status(201).json(newBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
});

// Update blog
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await prisma.blog.update({
            where: { id: Number(id) },
            data: {
                title: data.title,
                content: data.content,
                author: data.author,
                images: data.images,
            }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update blog' });
    }
});

// Delete blog
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.blog.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

export default router;
