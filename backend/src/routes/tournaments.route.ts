import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/client';

const createSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().optional(),
  game_id: z.string().min(1),
  entry_fee: z.number().min(0).max(1000),
  max_players: z.number().int().min(2).max(1000),
  starts_at: z.string().datetime(),
  rules: z.string().optional(),
});

const joinSchema = z.object({
  display_name: z.string().min(1).max(100),
  game_username: z.string().min(1).max(100),
});

export async function tournamentRoutes(app: FastifyInstance) {
  // List tournaments
  app.get('/tournaments', async (request, reply) => {
    const { status, game } = request.query as { status?: string; game?: string };
    let query = 'SELECT * FROM tournaments WHERE 1=1';
    const params: unknown[] = [];
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    if (game) { params.push(game); query += ` AND game_id = $${params.length}`; }
    query += ' ORDER BY starts_at ASC LIMIT 50';
    const result = await db.query(query, params);
    return reply.send({ data: result.rows });
  });

  // Get single tournament + participants
  app.get('/tournaments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const [t, p] = await Promise.all([
      db.query('SELECT * FROM tournaments WHERE id = $1', [id]),
      db.query('SELECT display_name, game_username, joined_at, placement FROM tournament_participants WHERE tournament_id = $1 ORDER BY joined_at ASC', [id]),
    ]);
    if (!t.rows[0]) return reply.status(404).send({ error: 'Tournament not found' });
    return reply.send({ data: { ...t.rows[0], participants: p.rows } });
  });

  // Create tournament
  app.post('/tournaments', async (request, reply) => {
    const body = createSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid data', details: body.error.flatten() });
    const { title, description, game_id, entry_fee, max_players, starts_at, rules } = body.data;
    const result = await db.query(
      `INSERT INTO tournaments (title, description, game_id, entry_fee, max_players, starts_at, rules)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description ?? null, game_id, entry_fee, max_players, starts_at, rules ?? null]
    );
    return reply.status(201).send({ data: result.rows[0] });
  });

  // Join tournament
  app.post('/tournaments/:id/join', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = joinSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid data' });

    const tournament = await db.query('SELECT * FROM tournaments WHERE id = $1', [id]);
    if (!tournament.rows[0]) return reply.status(404).send({ error: 'Tournament not found' });
    const t = tournament.rows[0];
    if (t.status !== 'open') return reply.status(400).send({ error: 'Tournament is not open for registration', code: 'NOT_OPEN' });
    if (t.current_players >= t.max_players) return reply.status(400).send({ error: 'Tournament is full', code: 'FULL' });

    await db.query('BEGIN');
    try {
      await db.query(
        `INSERT INTO tournament_participants (tournament_id, display_name, game_username, credits_paid)
         VALUES ($1,$2,$3,$4)`,
        [id, body.data.display_name, body.data.game_username, t.entry_fee]
      );
      await db.query(
        `UPDATE tournaments SET current_players = current_players + 1, prize_pool = prize_pool + $1 WHERE id = $2`,
        [t.entry_fee, id]
      );
      await db.query('COMMIT');
    } catch (err: unknown) {
      await db.query('ROLLBACK');
      const pgErr = err as { code?: string };
      if (pgErr.code === '23505') return reply.status(409).send({ error: 'You already joined this tournament', code: 'ALREADY_JOINED' });
      throw err;
    }
    return reply.status(201).send({ message: 'Joined successfully' });
  });
}
