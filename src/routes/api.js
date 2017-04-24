import express from 'express';
import articleModel from '../models/article';
// helper
import Logger from '../helper/Logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

const router = express.Router();

router.get('/articles', async (req, res) => {
  try {
    const query = req.query;

    if (query) {
      let { from, limit, cate } = query;
      let rs = {};
      from = from ? parseInt(from) : null;
      limit = limit ? parseInt(limit) : null;
      if (cate) {
        log.info('get list article by cate', query);
        rs = await articleModel.listArticleByCate({ from, limit, cate });
      } else {
        log.info('get list article ', query);
        rs = await articleModel.listArticles({ from, limit });
      }
      res.json(rs);
    }
  } catch (e) {
    log.error(e);
    res.status(404);
    res.json({ Error: { message: e.message } });
  }
});

export default router;
