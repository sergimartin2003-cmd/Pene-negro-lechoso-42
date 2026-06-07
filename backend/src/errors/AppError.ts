export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class PlayerNotFoundError extends AppError {
  constructor(name: string, game: string) {
    super(404, `Player "${name}" not found in ${game}`, 'PLAYER_NOT_FOUND');
  }
}

export class GameApiDownError extends AppError {
  constructor(game: string) {
    super(503, `${game} API is currently unavailable`, 'GAME_API_DOWN');
  }
}

export class PrivateProfileError extends AppError {
  constructor(name: string) {
    super(403, `Profile "${name}" is set to private`, 'PRIVATE_PROFILE');
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super(429, 'Rate limit exceeded. Please try again later.', 'RATE_LIMITED');
  }
}
