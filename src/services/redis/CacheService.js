const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    // create Redis client
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });

    // handle connection error
    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    // connect ke Redis server
    this._client.connect().catch((error) => {
      console.error('Failed to connect to Redis:', error);
    });
  }

  // set cache dengan TTL (Time To Live)
  async set(key, value, expirationInSeconds = 1800) {
    try {
      await this._client.set(key, value, {
        EX: expirationInSeconds, // 1800 detik = 30 menit (default)
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // get cache
  async get(key) {
    try {
      const result = await this._client.get(key);
      return result;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // delete cache (untuk invalidation)
  async delete(key) {
    try {
      await this._client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
}

module.exports = CacheService;
