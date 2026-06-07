import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const linkAccountSchema = z.object({
  userId: z.string().uuid(),
  gameId: z.enum(['valorant', 'cs2']),
  externalId: z.string().min(1),
  displayName: z.string().min(1),
  region: z.string().optional(),
});

export async function profileRoutes(app: FastifyInstance) {
  app.post('/profile/link-account', async (request, reply) => {
    const body = linkAccountSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid parameters', details: body.error.flatten() });
    }

    // Placeholder — full implementation requires auth middleware
    return reply.status(501).send({ error: 'Not implemented yet', code: 'NOT_IMPLEMENTED' });
  });
}
