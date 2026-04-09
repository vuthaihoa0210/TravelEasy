import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all tours
router.get('/', async (req: Request, res: Response) => {
    try {
        const tours = await prisma.tour.findMany();
        res.json(tours);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tours' });
    }
});

// Get tour by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tour = await prisma.tour.findUnique({
            where: { id: Number(id) },
        });
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return
        }
        res.json(tour);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
});

// Create new tour
router.post('/', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newTour = await prisma.tour.create({
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
                price: Number(data.price),
                image: data.image || '/images/default.jpg',
                rating: Number(data.rating || 0),
                category: data.category || 'DOMESTIC',
                duration: data.duration || '3N2Đ',
                itinerary: data.itinerary
            }
        });
        res.status(201).json(newTour);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create tour' });
    }
});

// Update tour
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await prisma.tour.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
                price: Number(data.price),
                image: data.image,
                rating: Number(data.rating),
                category: data.category,
                duration: data.duration,
                itinerary: data.itinerary
            }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update tour' });
    }
});

// Delete tour
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.tour.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tour' });
    }
});

export default router;
