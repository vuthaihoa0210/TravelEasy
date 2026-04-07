require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  // Tìm các chuyến bay có tên chỉ là tên hãng (không có "Vé máy bay" hay "Vé quốc tế")
  const badFlights = await prisma.flight.findMany({
    where: {
      AND: [
        { name: { not: { contains: 'Vé' } } }
      ]
    }
  });

  console.log('Các chuyến bay có tên không hợp lệ:');
  console.log(JSON.stringify(badFlights, null, 2));

  // Xóa các chuyến bay bị lỗi này
  if (badFlights.length > 0) {
    const ids = badFlights.map(f => f.id);
    await prisma.flight.deleteMany({ where: { id: { in: ids } } });
    console.log(`\n>> Đã xóa ${badFlights.length} chuyến bay bị lỗi.`);
  } else {
    console.log('\n>> Không tìm thấy chuyến bay nào bị lỗi.');
  }

  await prisma.$disconnect();
}

fix().catch(e => { console.error(e); process.exit(1); });
