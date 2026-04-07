const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding stock for flights and hotels...');
    const getRandom = () => Math.floor(Math.random() * 6) + 5; // 5 to 10
    
    const hotels = await prisma.hotel.findMany();
    for (let h of hotels) {
        await prisma.hotel.update({ 
            where: { id: h.id }, 
            data: { 
                availableSingle: getRandom(), 
                availableDouble: getRandom() 
            } 
        });
    }

    const flights = await prisma.flight.findMany();
    for (let f of flights) {
        await prisma.flight.update({ 
            where: { id: f.id }, 
            data: { 
                availableEconomy: getRandom(), 
                availableBusiness: getRandom() 
            } 
        });
    }
    console.log('Stock updated successfully!');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
