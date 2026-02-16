import 'dotenv/config';
import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
  // Verificar conexión a DB
  await prisma.$connect();
  console.log('✓ Conectado a PostgreSQL');

  app.listen(env.PORT, () => {
    console.log(`✓ Servidor corriendo en http://localhost:${env.PORT}`);
    console.log(`  Endpoints:`);
    console.log(`  POST /api/auth/register`);
    console.log(`  POST /api/auth/login`);
    console.log(`  GET  /api/auth/me`);
    console.log(`  CRUD /api/clients`);
    console.log(`  CRUD /api/orders`);
    console.log(`  GET  /api/reports/daily`);
    console.log(`  GET  /api/reports/weekly`);
  });
}

main().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
