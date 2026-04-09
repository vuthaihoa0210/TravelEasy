
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a booking
router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, type, itemId, itemName, startDate, endDate, price, customerName, customerPhone, totalPeople, seatClass, voucherCode, flightId, hotelId } = req.body;

        if (!userId || !type || !itemId || !startDate || !price || !customerName || !customerPhone) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        let qty = Number(totalPeople) || 1;

        if (type === 'FLIGHT') {
            const flight = await prisma.flight.findUnique({ where: { id: Number(itemId) }});
            if (!flight) return res.status(404).json({ error: 'Flight not found' });
            if (seatClass === 'BUSINESS') {
                if (flight.availableBusiness < qty) return res.status(400).json({ error: 'Hết vé thương gia' });
                await prisma.flight.update({ where: { id: flight.id }, data: { availableBusiness: flight.availableBusiness - qty }});
            } else {
                if (flight.availableEconomy < qty) return res.status(400).json({ error: 'Hết vé phổ thông' });
                await prisma.flight.update({ where: { id: flight.id }, data: { availableEconomy: flight.availableEconomy - qty }});
            }
        } else if (type === 'HOTEL') {
            const hotel = await prisma.hotel.findUnique({ where: { id: Number(itemId) }});
            if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
            if (seatClass === 'DOUBLE') {
                if (hotel.availableDouble < qty) return res.status(400).json({ error: 'Hết phòng đôi' });
                await prisma.hotel.update({ where: { id: hotel.id }, data: { availableDouble: hotel.availableDouble - qty }});
            } else {
                if (hotel.availableSingle < qty) return res.status(400).json({ error: 'Hết phòng đơn' });
                await prisma.hotel.update({ where: { id: hotel.id }, data: { availableSingle: hotel.availableSingle - qty }});
            }
        } else if (type === 'TOUR') {
            if (flightId) {
                const flight = await prisma.flight.findUnique({ where: { id: Number(flightId) }});
                if (flight) {
                    if (flight.availableEconomy < qty) return res.status(400).json({ error: 'Hết vé chuyến bay kèm theo' });
                    await prisma.flight.update({ where: { id: flight.id }, data: { availableEconomy: flight.availableEconomy - qty }});
                }
            }
            if (hotelId) {
                const hotel = await prisma.hotel.findUnique({ where: { id: Number(hotelId) }});
                if (hotel) {
                    if (hotel.availableSingle < qty) return res.status(400).json({ error: 'Hết phòng khách sạn kèm theo' });
                    await prisma.hotel.update({ where: { id: hotel.id }, data: { availableSingle: hotel.availableSingle - qty }});
                }
            }
        }

        let discountAmount = 0;
        let finalPrice = price;

        // Verify and Apply Voucher
        if (voucherCode) {
            const voucher = await prisma.voucher.findUnique({
                where: { code: voucherCode }
            });

            if (voucher && voucher.isActive) {
                const now = new Date();
                if (now >= voucher.startDate && now <= voucher.endDate) {
                    if (price >= voucher.minOrderValue) {
                        // Check if user has ALREADY USED this voucher
                        let userVoucher = await prisma.userVoucher.findFirst({
                            where: {
                                userId: Number(userId),
                                voucherId: voucher.id,
                            }
                        });

                        if (userVoucher && userVoucher.isUsed) {
                            // Cannot use again
                            console.log("Voucher already used by user");
                        } else {
                            // Calculate Discount
                            if (voucher.type === 'PERCENT') {
                                discountAmount = (price * voucher.value) / 100;
                                if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                                    discountAmount = voucher.maxDiscount;
                                }
                            } else {
                                discountAmount = voucher.value;
                            }
                            if (discountAmount > price) discountAmount = price;
                            finalPrice = price - discountAmount;

                            // Mark as Used (or Create and Mark)
                            if (userVoucher) {
                                await prisma.userVoucher.update({
                                    where: { id: userVoucher.id },
                                    data: { isUsed: true }
                                });
                            } else {
                                await prisma.userVoucher.create({
                                    data: {
                                        userId: Number(userId),
                                        voucherId: voucher.id,
                                        isUsed: true
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }

        const booking = await prisma.booking.create({
            data: {
                userId: Number(userId),
                type,
                itemId: Number(itemId),
                itemName,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                price,
                customerName,
                customerPhone,
                totalPeople: qty,
                seatClass,
                flightId: flightId ? Number(flightId) : null,
                hotelId: hotelId ? Number(hotelId) : null,
                voucherCode,
                discountAmount,
                finalPrice,
                status: 'PENDING'
            }
        });
        res.json(booking);
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get user bookings
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const bookings = await prisma.booking.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' }
        });

        const enrichedBookings = await Promise.all(bookings.map(async (b: any) => {
            const bookingObj = JSON.parse(JSON.stringify(b));
            console.log(`Booking ${b.id}: flightId=${b.flightId} (type=${typeof b.flightId}), hotelId=${b.hotelId} (type=${typeof b.hotelId})`);
            if (b.flightId) {
                const flight = await prisma.flight.findUnique({ where: { id: Number(b.flightId) } });
                console.log(`  -> flight lookup for ${Number(b.flightId)}:`, flight ? flight.name : 'null');
                bookingObj.flight = flight ? JSON.parse(JSON.stringify(flight)) : null;
            }
            if (b.hotelId) {
                const hotel = await prisma.hotel.findUnique({ where: { id: Number(b.hotelId) } });
                console.log(`  -> hotel lookup for ${Number(b.hotelId)}:`, hotel ? hotel.name : 'null');
                bookingObj.hotel = hotel ? JSON.parse(JSON.stringify(hotel)) : null;
            }
            return bookingObj;
        }));

        res.json(enrichedBookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get all bookings (Admin)
router.get('/', async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } } // Optional: include user info
        });

        const enrichedBookings = await Promise.all(bookings.map(async (b: any) => {
            const bookingObj = JSON.parse(JSON.stringify(b));
            if (b.flightId) bookingObj.flight = await prisma.flight.findUnique({ where: { id: b.flightId } }).then(f => f ? JSON.parse(JSON.stringify(f)) : null);
            if (b.hotelId) bookingObj.hotel = await prisma.hotel.findUnique({ where: { id: b.hotelId } }).then(h => h ? JSON.parse(JSON.stringify(h)) : null);
            return bookingObj;
        }));

        res.json(enrichedBookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Update booking status (Admin)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status }
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

export default router;
