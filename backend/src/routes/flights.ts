import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
    try {
        const flights = await prisma.flight.findMany();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch flights' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const flight = await prisma.flight.findUnique({
            where: { id: Number(id) },
        });
        if (!flight) {
            res.status(404).json({ error: 'Flight not found' });
            return;
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flight' });
    }
});

// Create new flight
router.post('/', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newFlight = await prisma.flight.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                location: data.location,
                price: Number(data.price),
                image: data.image || '/images/default.jpg',
                rating: Number(data.rating || 0),
                category: data.category || 'DOMESTIC',
            }
        });
        res.status(201).json(newFlight);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create flight' });
    }
});

// Update flight
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await prisma.flight.update({
            where: { id: Number(id) },
            data: {
                code: data.code,
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
        res.status(500).json({ error: 'Failed to update flight' });
    }
});

// Delete flight
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.flight.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete flight' });
    }
});

export default router;
