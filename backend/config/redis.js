const redisLib = require("redis");

class Redis {
  constructor() {
    if (!Redis.instance) {
      this.client = redisLib.createClient();
      Redis.instance = this;
    }
    return Redis.instance;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value) {
    return await this.client.set(key, value);
  }
}

const instance = new Redis();
Object.freeze(instance);

module.exports = instance;
