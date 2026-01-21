const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

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

    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            email: 'user@test.com',
            name: 'Test User',
            password: userPassword,
            phone: '+1234567890',
            address: '123 Test Street, Test City',
        },
    });

    console.log({ admin, user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
