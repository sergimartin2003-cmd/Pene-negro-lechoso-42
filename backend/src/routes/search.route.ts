import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getCached, setCached, buildCacheKey } from '../cache/redis';
import { getAccountByRiotId, getMatchHistoryByPuuid, getRankedByPuuid } from '../services/valorant.service';
import { getCS2Stats, getPlayerSummary, resolveVanityUrl } from '../services/cs2.service';
import { normalizeValorantStats } from '../normalizers/valorant.normalizer';
import { normalizeCS2Stats } from '../normalizers/cs2.normalizer';
import { AppError } from '../errors/AppError';
import type { NormalizedPlayerStats } from '../normalizers/types';

const searchSchema = z.object({
  game: z.enum(['valorant', 'cs2']),
  name: z.string().min(1).max(100),
  tag: z.string().optional(),    // Riot: required. Steam: unused
  region: z.string().default('eu'),
});

export async function searchRoutes(app: FastifyInstance) {
  app.get('/search', async (request, reply) => {
    const query = searchSchema.safeParse(request.query);
    if (!query.success) {
      return reply.status(400).send({ error: 'Invalid parameters', details: query.error.flatten() });
    }

    const { game, name, tag, region } = query.data;
    const cacheKey = buildCacheKey(game, region, tag ? `${name}#${tag}` : name);

    // 1. Try cache
    const cached = await getCached<NormalizedPlayerStats>(cacheKey);
    if (cached) {
      return reply.send({ data: cached, source: 'cache' });
    }

    try {
      let stats: NormalizedPlayerStats;

      if (game === 'valorant') {
        if (!tag) return reply.status(400).send({ error: 'tag is required for Valorant (e.g. EU1)' });
        const account = await getAccountByRiotId(name, tag);
        const [ranked, matches] = await Promise.all([
          getRankedByPuuid(region, account.puuid),
          getMatchHistoryByPuuid(region, account.puuid),
        ]);
        stats = normalizeValorantStats(account, ranked, matches as never[], account.puuid);
      } else {
        // CS2 — resolve SteamID if needed
        const steamId = /^\d{17}$/.test(name) ? name : await resolveVanityUrl(name);
        const [summary, cs2Stats] = await Promise.all([
          getPlayerSummary(steamId),
          getCS2Stats(steamId).catch(() => null),
        ]);
        stats = normalizeCS2Stats(summary, cs2Stats as never);
      }

      // 2. Store in cache
      await setCached(cacheKey, stats);

      return reply.send({ data: stats, source: 'live' });

    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message, code: err.code });
      }
      app.log.error(err);
      return reply.status(500).send({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  });
}
