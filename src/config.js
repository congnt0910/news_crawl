const configData = require('../config.json');

export const port = configData.port || 9125;

const tmpRedisCfg ={
  host: configData.redis.host,
  port: configData.redis.port,
  password: configData.redis.password,
};

export const redis = {};
Object.keys(tmpRedisCfg).forEach(key => {
  if (tmpRedisCfg[key]) {
    redis[key] = tmpRedisCfg[key];
  }
});

