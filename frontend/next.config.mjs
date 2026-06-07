

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.valorant-api.com' },
      { protocol: 'https', hostname: 'avatars.steamstatic.com' },
      { protocol: 'https', hostname: 'steamcdn-a.akamaihd.net' },
    ],
  },
};

export default nextConfig;
