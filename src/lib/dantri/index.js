import cheerio from 'cheerio';
import Base from '../core/Parser';


class DanTri extends Base {
  constructor () {
    super({
      host: 'http://dantri.com.vn',
      listArticlesSelector: '.fl.wid470',
      articleSelector: '.mt3.clearfix',
      thumbSelector: 'a > img',
      titleSelector: '.mr1 > h2 > a',
      excerptSelector: '.fon5.wid324.fl, .fon5.wid255.fl',
      contentSelector: '#divNewsContent'
    });
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
}

export default DanTri;
