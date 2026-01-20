const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);

    const admin = await prisma.admin.upsert({
        where: { email: 'admin@foodieorder.com' },
        update: {},
        create: {
            email: 'admin@foodieorder.com',
            name: 'Super Admin',
            password: password,
            role: 'admin',
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
