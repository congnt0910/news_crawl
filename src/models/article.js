import store from './store';
// helper
import Logger from '../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

const preKey = 'article';
const prefix = {
  index: `${preKey}:index:`,
  hash: `${preKey}:hash:`,
  indexAll: `ref_cate_article:all`,
  indexCate: `ref_cate_article:`
};

/**
 * Check article is exist or not
 * @param key {string} article key
 * @returns {Promise.<int>} 1: exist; 0: not exist
 */
const checkExist = async (key) => {
  return await store.getClient().existsAsync(key);
};

/**
 * Save article to db
 * @param article {Article}
 * @returns {Promise.<boolean>}
 */
const save = async (article) => {
  try {
    const articleKey = `${prefix.hash}${article.alias}`;
    // check key exist
    const keyExist = await checkExist(articleKey);
    if (keyExist) {
      log.info(`Skipped save article - Key exist: ${articleKey}`);
      return true;
    }

    const multi = store.getClient().multi();
    // store article
    const hmsetArgs = [articleKey];
    const props = article.toObject();
    for (let p in props) {
      hmsetArgs.push(p);
      hmsetArgs.push(props[p]);
    }
    // log.debug(`hmset args: ${JSON.stringify(hmsetArgs)}`);
    multi.hmset.apply(multi, hmsetArgs);

    // update index category
    __index(article.alias, article.category.alias, multi);

    await multi.execAsync();
    return true;
  } catch (e) {
    log.error(e);
    throw e;
  }
};

/**
 *
 * @param articleKey
 * @param categoryKey
 * @param client
 * @private
 */
const __index = (articleKey, categoryKey, client) => {
  // client.mset([articleKey, true]);
  client.lpush([prefix.indexAll, articleKey]);
  client.lpush([`${prefix.indexCate}${categoryKey}`, articleKey]);
};

/**
 * Retrieve list articles
 * @param from {int} The number of first items to be skipped in the returned array. Default 0
 * @param limit {int} The total number of items returned. Default 1
 * @returns {Promise.<Array.<Article>>}
 */
const listArticles = async ({ from, limit }) => {
  from = from && from > 0 ? from : 0;
  limit = limit && limit > 0 ? limit : 1;
  const start = from;
  const end = (from - 1) + limit;
  let listArticleKeys = await store.getClient().lrangeAsync([prefix.indexAll, start, end]);
  log.info(`list articles keys: ${listArticleKeys}`);
  const multi = store.getClient().multi();

  listArticleKeys.map(item => {
    const key = `${prefix.hash}${item}`;
    multi.hgetall(key);
  });
  return await multi.execAsync();
};

/**
 * Retrieve list articles by category
 * @param from {int} The number of first items to be skipped in the returned array. Default 0
 * @param limit {int} The total number of items returned. Default 1
 * @param cate {string} category alias
 * @returns {Promise.<Array.<Article>>}
 */
const listArticleByCate = async ({ from, limit, cate }) => {
  from = from && from > 0 ? from : 0;
  limit = limit && limit > 0 ? limit : 1;
  const start = from;
  const end = (from - 1) + limit;

  // check cate
  const cateIndexKey = `${prefix.indexCate}${cate}`;
  const cateExist = await store.getClient().existsAsync(cateIndexKey);
  if (!cateExist) {
    log.error(`Not found category ${cate}`);
    throw new Error('Not found category');
  }

  // get list article keys
  const listArticleKeys = await store.getClient().lrangeAsync([cateIndexKey, start, end]);
  log.debug(`list articles keys: ${listArticleKeys}`);
  const multi = store.getClient().multi();

  listArticleKeys.map(item => {
    const key = `${prefix.hash}${item}`;
    multi.hgetall(key);
  });
  return await multi.execAsync();
};

export default {
  save,
  listArticles,
  listArticleByCate
};
