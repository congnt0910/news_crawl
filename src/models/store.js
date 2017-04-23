import redis from 'redis';
import bluebird from 'bluebird';
import { redis as redisConfig } from '../config';
// helper
import Logger from '../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

// Config use promises. It'll add a Async to all node_redis functions
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
//
const client = redis.createClient({ ...redisConfig });

let ready = false;

client.on('ready', () => {
  ready = true;
});

client.on('error', (err) => {
  log.error(err);
});

const isReady = () => {
  return new Promise((resolve) => {
    const waitReady = () => {
      if (ready) {
        log.info('Redis is ready');
        return resolve(ready);
      }
      setTimeout(() => {
        waitReady();
      }, 60);
    };
    waitReady();
  });
};

const getClient = () => {
  if (!client.connected) {
    throw new Error('Tried accessing a redis client that is not connected to a database');
  }
  return client;
};

export default {
  getClient,
  isReady
};
