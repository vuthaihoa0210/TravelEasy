const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.voucher.findMany().then(v => { console.log(JSON.stringify(v, null, 2)); process.exit(0); });
