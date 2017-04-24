import log4js from 'log4js';

const prefix = '/news_crawler';

// log the logger messages to a file, and the console ones as well.
log4js.configure({
  appenders: [
    {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d]%] %[[%p]%] %[[%c]%] %m'
      }
    }
  ]
  // replaceConsole: true,
});

export default class Logger {
  constructor (filePath) {
    this.filePath = filePath;
  }

  trimFilename = () => {
    const fullPath = this.filePath;
    let finalFilename = fullPath;
    // get file name
    const firstTrimIdx = fullPath.indexOf(prefix);
    if (firstTrimIdx > -1) {
      finalFilename = fullPath.substring(firstTrimIdx + prefix.length);
    }
    // get caller function line number
    const stack = (new Error().stack).toString().split('\n');
    const lenStack = stack.length;
    let lineNumberStr = '';
    for (let i = 0; i < lenStack; i++) {
      const stackLine = stack[i];
      const idx = stackLine.indexOf(finalFilename);
      if (idx > -1) {
        lineNumberStr = stackLine.substring(idx + finalFilename.length).trim().replace(')', '');
        break;
      }
    }
    finalFilename += lineNumberStr;

    return finalFilename;
  };

  info = (...args) => {
    const filename = this.trimFilename();
    const logger = log4js.getLogger(filename);
    logger.info(...args);
  };

  warn = (...args) => {
    const filename = this.trimFilename();
    const logger = log4js.getLogger(filename);
    logger.warn(...args);
  };

  debug = (...args) => {
    if(process.env.DEBUG != 'true') return; // eslint-disable-line no-undef
    const filename = this.trimFilename();
    const logger = log4js.getLogger(filename);
    logger.debug(...args);
  };

  error = (...args) => {
    const filename = this.trimFilename();
    const logger = log4js.getLogger(filename);
    logger.error(...args);
  }
}
