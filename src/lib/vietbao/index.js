import Base from '../core/Parser';
import Article from '../core/Article';
// helper
import Logger from '../../helper/Logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class VietBao extends Base {
  constructor () {
    super({
      host: 'http://vietbao.vn/',
      listArticlesSelector: '.module.mod-c-content .mod-body ul',
      articleSelector: 'li',
      thumbSelector: '.thumb > a > img, .c-lg-sukien > a > img',
      titleSelector: '.r-c-content a.title-lg, .div-a > h2 > a',
      excerptSelector: '.r-c-content > p',
      contentSelector: '#vb-content-detailbox'
    });
  }

  /**
   *
   * @param $body
   * @param listArticleObj
   * @returns {*}
   * @override
   */
  beforeGetListArticlesBlock ({ $body, listArticleObj }) { // eslint-disable-line no-unused-vars
    log.debug(`beforeGetListArticlesBlock`);
    const $article = $body.find('.no-padding.mod-pos2-main');
    let articleObj = new Article();

    articleObj.setThumb(this.getThumbs({ $article }));
    const title = this.getTitle({ $article });
    articleObj.setTitle(title.title);
    articleObj.setUrl(title.url);
    //
    const $excerpt = $article.find('.mod-body p');
    articleObj.setExcerpt($excerpt.text());

    listArticleObj.push(articleObj);

    return $body;
  }

  /**
   *
   * @param $listArticles
   * @param listArticleObj
   * @returns {*}
   * @override
   */
  beforeParseListArticles ({ $listArticles, listArticleObj }) { // eslint-disable-line no-unused-vars
    log.debug('beforeParseListArticles: remove clearfix');
    $listArticles = $listArticles.not('li.clearfix');
    return $listArticles;
  }
}

export default VietBao;

