import childProcess from 'child_process';
import path from 'path';
import os from 'os';
import ProcessWrapper from './ProcessWrapper';
// helper
import Logger from '../helper/Logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class ProccessManage {
  constructor ({ maxProcess }) {
    this.maxProcess = maxProcess || Math.ceil(os.cpus().length / 2);
    this.dictProcess = {}; // { pid: ProcessWrapper }
    this.jobQueue = [];
    this.processPath = path.resolve(__dirname, './worker');
    this.cycleCheckJobQueue = 60; // 60 ms
    this.timeOutCycleCheckJobQueue = null;
  }

  findProcessFree = () => {
    const pIdFree = Object.keys(this.dictProcess).find((pid) => {
      return this.dictProcess[pid].isFree();
    });
    return pIdFree ? this.dictProcess[pIdFree] : null;
  };

  onCycleCheckJobQueue = () => {
    this.timeOutCycleCheckJobQueue = setTimeout(() => {
      const pro = this.findProcessFree();
      if (this.jobQueue.length > 0 && pro) {
        this.doJob(pro);
      } else if (this.jobQueue.length == 0) {
        log.info('Not have job in queue. Stop cycle check job');
        clearTimeout(this.timeOutCycleCheckJobQueue);
        this.timeOutCycleCheckJobQueue = null;
        return;
      }
      this.onCycleCheckJobQueue();
    }, this.cycleCheckJobQueue);
  };

  /**
   * push job
   */
  pushJob = (job) => {
    this.jobQueue.push(job);
    // create more child process, if can
    if (Object.keys(this.dictProcess).length < this.maxProcess) {
      // create new process
      const child = childProcess.fork(this.processPath);
      const pro = new ProcessWrapper(child);
      log.debug('pid: ', child.pid);

      this.dictProcess[child.pid] = pro;

      pro.emitter.on('done', () => {
        const allDone = Object.keys(this.dictProcess).every((pid) => {
          return this.dictProcess[pid].isFree();
        });
        if (allDone && this.jobQueue.length === 0) {
          log.info('All job done !!!.');
        }
      });

      this.doJob(pro);
    } else if (!this.timeOutCycleCheckJobQueue) {
      // start auto start job from queue
      this.onCycleCheckJobQueue();
    }
  };

  doJob = (processWrapper) => {
    const job = this.jobQueue.shift();
    processWrapper.run(job);
  }
}


export default ProccessManage;
