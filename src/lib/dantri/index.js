import cheerio from 'cheerio';
import Base from '../core/Parser';
// helper
import Logger from '../../helper/Logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars


class DanTri extends Base {
  constructor () {
    const selectorsCfg = {
      normal: {
        listArticlesSelector: '.fl.wid470',
        articleSelector: '.mt3.clearfix',
        thumbSelector: 'a > img',
        titleSelector: '.mr1 > h2 > a',
        excerptSelector: '.fon5.wid324.fl, .fon5.wid255.fl',
        contentSelector: '#divNewsContent'
      },
      dulich: {
        listArticlesSelector: '.listcate.fl',
        articleSelector: 'li',
        thumbSelector: 'a > img.avatar',
        titleSelector: '> h2 > a, > h3 > a',
        excerptSelector: 'p.sapo',
        contentSelector: 'div.detail-content'
      }
    };
    super({
      ...selectorsCfg.normal,
      host: 'http://dantri.com.vn'
    });
    this.selectorsCfg = selectorsCfg;
  }

  /**
   * Remove anything look like non-content.
   * @param content {string} news content.
   * @returns {string} content after clear up.
   * @override
   */
  contentClearUp ({ content }) {
    content = content.trim().replace(/\(Dân trí\)/g, '');
    const $ = cheerio.load(content);
    $('.news-tag').remove();
    return $.html();
  }

  /**
   * Fetch and parse news articles for a category.
   * @param path {string} category path.
   * @param name {string} category name.
   * @param selector {string} selector key.
   * @returns {Promise.<Object>}
   * @override
   */
  async articles ({ path, name, selector }) {
    if(!selector || !this.selectorsCfg.hasOwnProperty(selector)){
      this.setSelector(this.selectorsCfg.normal);
    }else{
      this.setSelector(this.selectorsCfg[selector]);
    }
    return super.articles.apply(this, [{ path, name }]);
  }

  /**
   *
   * @param listArticlesSelector {string} the selector to search list article block.
   * @param articleSelector {string} the selector to search article in list article block.
   * @param thumbSelector {string} the selector to search thumbnail in article.
   * @param titleSelector {string} the selector to search title in article.
   * @param excerptSelector {string} the selector to search excerpt in article.
   * @param contentSelector {string} the selector to search full content of article. found this selector in article details.
   * @override
   */
  setSelector ({ listArticlesSelector, articleSelector, thumbSelector, titleSelector, excerptSelector, contentSelector }){
    super.setSelector.apply(this, [{
      listArticlesSelector,
      articleSelector,
      thumbSelector,
      titleSelector,
      excerptSelector,
      contentSelector
    }]);
  }
}

export default DanTri;
