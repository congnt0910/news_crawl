import Base from '../core/Parser';
// helper
import Logger from '../../helper/Logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class ZingNews extends Base {
  constructor () {
    super({
      host: 'http://news.zing.vn',
      listArticlesSelector: 'section.cate_content',
      articleSelector: 'article',
      thumbSelector: 'div.cover a img',
      titleSelector: 'header p.title a',
      excerptSelector: 'header p.summary',
      contentSelector: 'div.the-article-body.cms-body'
    });
  }

  /**
   *
   * @param $listArticlesBlock
   * @returns {*}
   * @override
   */
  beforeGetArticles({ $listArticlesBlock }){
    return $listArticlesBlock.eq(1);
  }
}

export default ZingNews;


