import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // Crear tenant demo
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'lavanderia-demo' },
    update: {},
    create: {
      name: 'Lavandería Demo',
      slug: 'lavanderia-demo',
      phone: '+54 11 1234-5678',
      address: 'Av. Corrientes 1234, CABA',
    },
  });

  // Crear usuario owner
  await prisma.user.upsert({
    where: { email_tenantId: { email: 'admin@demo.com', tenantId: tenant.id } },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Admin Demo',
      role: 'OWNER',
      tenantId: tenant.id,
    },
  });

  // Crear algunos clientes
  const client1 = await prisma.client.upsert({
    where: { phone_tenantId: { phone: '1155551234', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'María García',
      phone: '1155551234',
      tenantId: tenant.id,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { phone_tenantId: { phone: '1155555678', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Carlos López',
      phone: '1155555678',
      tenantId: tenant.id,
    },
  });

  // Crear pedidos de ejemplo
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { ticketCounter: 2 },
  });

  await prisma.order.create({
    data: {
      ticketNumber: 1,
      tenantId: tenant.id,
      clientId: client1.id,
      totalPrice: 2500,
      status: 'READY',
      estimatedDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      items: {
        create: [
          { description: 'Camisa blanca', quantity: 2, unitPrice: 500 },
          { description: 'Pantalón de vestir', quantity: 1, unitPrice: 800 },
          { description: 'Saco', quantity: 1, unitPrice: 700 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      ticketNumber: 2,
      tenantId: tenant.id,
      clientId: client2.id,
      totalPrice: 1800,
      status: 'WASHING',
      estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { description: 'Acolchado king size', quantity: 1, unitPrice: 1800 },
        ],
      },
    },
  });

  console.log('✓ Seed completado');
  console.log('  Credenciales demo:');
  console.log('  Email: admin@demo.com');
  console.log('  Password: 123456');
  console.log('  Tenant slug: lavanderia-demo');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
