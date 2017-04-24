/**
 * This is child process to call to lib corresponding.
 * - Receive info and start crawl
 */

import fs from 'fs';
import path from 'path';
// helper
import Logger from '../helper/Logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class Worker {
  ignorefiles = ['core'];

  constructor () {
    this.libPath = '../lib/';
    this.libs = {};

    this.loadLib();
  }

  loadLib = () => {
    const filenames = fs.readdirSync(path.resolve(__dirname, this.libPath));
    filenames.forEach(filename => {
      if (this.ignorefiles.indexOf(filename) > -1) return;
      this.libs[filename] = require(this.libPath + filename).default;
    });
  };


  start = (job) => {
    log.debug('Receive job', job);

    if (!job) {
      log.error('Job information is required');
      // emit done to free this process to other job can use
      return this.done(job);
    }

    if (!this.libs[job.agent]) {
      log.error(`library not support crawl from ${job.agent}`);
      return this.done(job);
    }

    log.info(`Start job ${job.agent} ${job.name}`);
    const crawlObj = new this.libs[job.agent]();

    return crawlObj.articles({ path: job.path, name: job.name })
      .then(rs => {
        return crawlObj.save(rs);
      })
      .then(() => {
        return this.done(job);
      })
      .catch(err => {
        log.error(err);
        return this.done(job);
      });
  };

  done = (job) => {
    log.info(`Set done job ${job.agent} ${job.name}`);
    process.send({ emit: 'done' });
  }

}

const _worker = new Worker();

/**
 * packet {
 *  emit: func name.
 *  data: {}
 * }
 */
process.on('message', (packet) => {
  if (packet.emit) {
    if (typeof _worker[packet.emit] == 'function') {
      // log.debug('emit function : ', packet.emit);
      _worker[packet.emit].apply(_worker, [packet.job]);
    }
  }
});

process.on('error', (err) => {
  log.error('whoops! there was an error :D ', err.stack);
});

// export default Worker;
