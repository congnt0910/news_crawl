import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
//
import { port } from './config';
import apiRoute from './routes/api';
// helper
import Logger from './helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'index' });
});

app.use('/api/v1', apiRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ Error: { status: err.status, message: err.message } });
});


app.listen(port, () => {
  log.info(`The server is running at http://localhost:${port}/`);
});
