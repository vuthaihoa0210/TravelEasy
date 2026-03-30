import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
    try {
        const hotels = await prisma.hotel.findMany();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const hotel = await prisma.hotel.findUnique({
            where: { id: Number(id) },
        });
        if (!hotel) {
            res.status(404).json({ error: 'Hotel not found' });
            return;
        }
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotel' });
    }
});

// Create new hotel
router.post('/', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newHotel = await prisma.hotel.create({
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
                price: Number(data.price),
                image: data.image || '/images/default.jpg',
                rating: Number(data.rating || 0),
                category: data.category || 'DOMESTIC',
            }
        });
        res.status(201).json(newHotel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create hotel' });
    }
});

// Update hotel
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await prisma.hotel.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
                price: Number(data.price),
                image: data.image,
                rating: Number(data.rating),
                category: data.category,
            }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update hotel' });
    }
});

// Delete hotel
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.hotel.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete hotel' });
    }
});

export default router;
