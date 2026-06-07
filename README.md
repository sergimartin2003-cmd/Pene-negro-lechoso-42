# GameStats — Unified Gaming Profile

Track your stats across Valorant, CS2 and more in one place.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend**: Node.js + Fastify + TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7

## Getting Started

### 1. Start infrastructure

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in your API keys
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Keys Required

- **Riot Games API**: https://developer.riotgames.com/
- **Steam Web API**: https://steamcommunity.com/dev/apikey
