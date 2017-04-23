import Base from '../core/Parser';
// helper
import Logger from '../../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class PhuNuNews extends Base {
  constructor () {
    super({
      host: 'http://phununews.vn/',
      listArticlesSelector: '.list_news_forder ul.block-item-small-cat',
      articleSelector: 'li.item-cate-news',
      thumbSelector: '.thumb a img',
      titleSelector: '.title_news a',
      excerptSelector: '.news_lead',
      contentSelector: 'div.fck_detail.width_common.block_ads_connect'
    });
  }

}

export default PhuNuNews;



