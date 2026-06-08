import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../db/client';

const linkSchema = z.object({
  game_id: z.enum(['valorant', 'cs2', 'dota2']),
  external_id: z.string().min(1).max(200),
  display_name: z.string().min(1).max(100),
  region: z.string().optional(),
});

async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile/accounts', { onRequest: [verifyJwt] }, async (request, reply) => {
    const user = request.user as { id: string };
    const result = await db.query(
      'SELECT id, game_id, display_name, external_id, region, is_verified, linked_at FROM linked_accounts WHERE user_id = $1 ORDER BY linked_at ASC',
      [user.id]
    );
    return reply.send({ data: result.rows });
  });

  app.post('/profile/accounts', { onRequest: [verifyJwt] }, async (request, reply) => {
    const user = request.user as { id: string };
    const body = linkSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid data', details: body.error.flatten() });

    const { game_id, external_id, display_name, region } = body.data;

    const exists = await db.query(
      'SELECT id FROM linked_accounts WHERE game_id = $1 AND external_id = $2',
      [game_id, external_id]
    );
    if (exists.rows.length > 0) {
      return reply.status(409).send({ error: 'This account is already linked to a profile', code: 'ALREADY_LINKED' });
    }

    const result = await db.query(
      `INSERT INTO linked_accounts (user_id, game_id, external_id, display_name, region)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, game_id, display_name, external_id, region, is_verified, linked_at`,
      [user.id, game_id, external_id, display_name, region ?? null]
    );
    return reply.status(201).send({ data: result.rows[0] });
  });

  app.delete('/profile/accounts/:id', { onRequest: [verifyJwt] }, async (request, reply) => {
    const user = request.user as { id: string };
    const { id } = request.params as { id: string };
    await db.query(
      'DELETE FROM linked_accounts WHERE id = $1 AND user_id = $2',
      [id, user.id]
    );
    return reply.status(204).send();
  });
}
