require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const total = await prisma.flight.count();
  console.log('Total flights:', total);

  const locs = await prisma.flight.groupBy({
    by: ['location'],
    _count: { id: true },
    orderBy: { location: 'asc' }
  });

  console.log('\nSo ve theo diem den:');
  for (const l of locs) {
    console.log(l.location + ': ' + l._count.id + ' ve');
  }

  // Kiem tra cac diem den can thiet
  const tourLocations = ['Vu ng Tau', 'Vung Tau', 'Sapa', 'Ha Long', 'New York', 'Las Vegas', 'Sydney', 'Hong Kong'];
  console.log('\nKiem tra diem den:');
  for (const loc of locs) {
    const lower = loc.location.toLowerCase();
    if (lower.includes('vung') || lower.includes('sapa') || lower.includes('long') ||
        lower.includes('new york') || lower.includes('vegas') || lower.includes('sydney') || lower.includes('hong')) {
      console.log('>> ' + loc.location + ': OK (' + loc._count.id + ' ve)');
    }
  }

  await prisma.$disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
