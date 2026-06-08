import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db/client';

const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid data', details: body.error.flatten() });
    }
    const { username, email, password } = body.data;

    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return reply.status(409).send({ error: 'Email or username already taken', code: 'ALREADY_EXISTS' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, avatar_url, created_at`,
      [username, email, hash]
    );
    const user = result.rows[0];
    const token = app.jwt.sign({ id: user.id, username: user.username }, { expiresIn: '7d' });

    return reply.status(201).send({ token, user });
  });

  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid credentials' });
    }
    const { email, password } = body.data;

    const result = await db.query(
      'SELECT id, username, email, password_hash, avatar_url FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
    }

    const token = app.jwt.sign(
      { id: user.id, username: user.username },
      { expiresIn: '7d' }
    );

    return reply.send({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url },
    });
  });

  app.get('/auth/me', {
    onRequest: [async (request, reply) => {
      try { await request.jwtVerify(); } catch { reply.status(401).send({ error: 'Unauthorized' }); }
    }]
  }, async (request, reply) => {
    const payload = request.user as { id: string; username: string };
    const result = await db.query(
      'SELECT id, username, email, avatar_url, created_at FROM users WHERE id = $1',
      [payload.id]
    );
    if (!result.rows[0]) return reply.status(404).send({ error: 'User not found' });
    return reply.send({ user: result.rows[0] });
  });
}
