import EventEmitter from 'events';
// helper
import Logger from '../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars


const STATUS = {
  IDLE: 'IDLE',
  BUSY: 'BUSY'
};

/**
 * Wrapper for child process (worker)
 */
class ProcessWrapper {
  constructor (process) {
    this.process = process;
    this.status = STATUS.IDLE;
    this.emitter = new EventEmitter();

    this.process.on('message', (packet) => {
      switch (packet.emit) {
        case 'done':
          this.free();
          break;
      }
    });
  }

  free = () => {
    this.status = STATUS.IDLE;
    this.emitter.emit('done');
  };

  isFree = () => {
    return this.status == STATUS.IDLE;
  };

  run = (job) => {
    log.debug(' Send event start to worker');
    // change status to busy
    this.status = STATUS.BUSY;
    // send job info to child process
    this.process.send({ emit: 'start', job });
  }
}


export default ProcessWrapper;
