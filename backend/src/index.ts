import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { redis } from './cache/redis';
import { db } from './db/client';
import { searchRoutes } from './routes/search.route';
import { tournamentRoutes } from './routes/tournaments.route';
import { config } from './config';

const app = Fastify({ logger: { level: config.NODE_ENV === 'development' ? 'info' : 'warn' } });

async function bootstrap() {
  await app.register(helmet);
  await app.register(cors, { origin: ['http://localhost:3000'], credentials: true });
  await app.register(rateLimit, { max: 60, timeWindow: '1 minute' });

  app.get('/health', async () => ({
    status: 'ok',
    redis: await redis.ping().catch(() => 'down'),
    db: await db.query('SELECT 1').then(() => 'ok').catch(() => 'down'),
  }));

  await app.register(searchRoutes, { prefix: '/api/v1' });
  await app.register(tournamentRoutes, { prefix: '/api/v1' });

  await redis.connect();
  await app.listen({ port: config.PORT, host: '0.0.0.0' });
  console.log(`Backend running on http://localhost:${config.PORT}`);
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
