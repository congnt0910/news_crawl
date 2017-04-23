import cheerio from 'cheerio';
import url from 'url';
import fetch from 'node-fetch';
import Article from './Article';
import Category from './Category';
// helper
import Logger from '../../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class Parser {
  /**
   * Parse news articles by category
   * @param host {string} the root url of website to crawl. e.g.: http://news.com
   * @param listArticlesSelector {string} the selector to search list article block.
   * @param articleSelector {string} the selector to search article in list article block.
   * @param thumbSelector {string} the selector to search thumbnail in article.
   * @param titleSelector {string} the selector to search title in article.
   * @param excerptSelector {string} the selector to search excerpt in article.
   * @param contentSelector {string} the selector to search full content of article. found this selector in article details.
   */
  constructor ({ host, listArticlesSelector, articleSelector, thumbSelector, titleSelector, excerptSelector, contentSelector }) {
    let missParam = null;
    const valid = Object.keys({
      host,
      listArticlesSelector,
      articleSelector,
      thumbSelector,
      titleSelector,
      excerptSelector,
      contentSelector
    }).every((key) => {
      missParam = key;
      return !!arguments[0][key];
    });
    if (!valid) {
      throw new Error(`${missParam} is required`);
    }
    this.defaultHost = host;
    this.host = host;
    this.listArticlesSelector = listArticlesSelector;
    this.articleSelector = articleSelector;
    this.thumbSelector = thumbSelector;
    this.titleSelector = titleSelector;
    this.excerptSelector = excerptSelector;
    this.contentSelector = contentSelector;

    this.articles = this.articles.bind(this);
  }


  //region Func parse article
  /**
   * fetch thumbnail url of the article.
   * @param $article {Object} Cheerio's selector.
   * returns {string} thumbnail url.
   */
  getThumbs ({ $article }) {
    const $img = $article.find(this.thumbSelector);
    const thumb = $img.attr('src');
    log.debug(`Thumbnail: ${thumb}`);
    return thumb || '';
  }

  /**
   * fetch title of the article.
   * @param $article {Object} Cheerio's selector.
   * @returns {{url, title}} url and title of the article.
   */
  getTitle ({ $article }) {
    const $title = $article.find(this.titleSelector);
    const rs = {
      url: $title.attr('href'),
      title: $title.text()
    };
    log.debug(`title: ${JSON.stringify(rs)}`);
    return rs;
  }

  /**
   * fetch excerpt of the article.
   * @param $article {Object} Cheerio's selector.
   * @returns {string}
   */
  getExcerpt ({ $article }) {
    const $excerpt = $article.find(this.excerptSelector);
    return $excerpt.text();
  }

  /**
   * Remove anything look like non-content.
   * @param content {string} news content.
   * @returns {string} content after clear up.
   */
  contentClearUp ({ content }) {
    return content.trim();
  }

  /**
   * fetch full content of the article.
   * @param articleUrl {string}
   * @returns {Promise.<string>}
   */
  async getContent ({ articleUrl }) {
    try {
      if (articleUrl.indexOf(this.host) === -1) {
        articleUrl = url.resolve(this.host, articleUrl);
      }
      const response = await fetch(articleUrl);
      const body = await response.text();

      const $ = cheerio.load(body);
      const $body = $('body');
      if ($body.length === 0) {
        throw new Error('Not found body tag in response');
      }
      // get content block
      const $content = $body.find(this.contentSelector);
      let content = $content.html();
      content = this.contentClearUp({ content });
      return content;
    } catch (e) {
      log.error(`Fetch article content error. url: ${articleUrl} \n ${e.stack}`);
      throw e;
    }
  }

  //endregion


  //region Hooks func
  beforeGetListArticlesBlock ({ $body, listArticleObj }) { // eslint-disable-line no-unused-vars
    return $body;
  }

  beforeGetArticles ({ $listArticlesBlock }) {
    return $listArticlesBlock;
  }

  beforeParseListArticles ({ $listArticles, listArticleObj }) { // eslint-disable-line no-unused-vars
    return $listArticles;
  }

  //endregion


  isUrl = (path) => {
    const result = url.parse(path);
    const isUrl = result.host && result.protocol;
    if(isUrl) {
      this.host = `${result.protocol}://${result.host}`;
    }
    return isUrl;
  };

  /**
   * Fetch and parse news articles for a category.
   * @param path {string} category path.
   * @param name {string} category name.
   * @returns {Promise.<Object>}
   */
  async articles ({ path, name }) {
    const listArticleObj = [];
    this.host = this.defaultHost;
    const cateUrl = this.isUrl(path) ? path : url.resolve(this.host, path);
    const cate = new Category({ url: cateUrl, name });

    log.debug(`Start fetch category ${name} ; ${cateUrl}`);
    // make request
    const response = await fetch(cateUrl);
    const body = await response.text();

    const $ = cheerio.load(body);
    let $body = $('body');
    if ($body.length === 0) {
      log.error('Not found body tag in response');
      throw new Error('Not found body tag in response');
    }

    $body = this.beforeGetListArticlesBlock({ $body, listArticleObj });

    // get list articles block
    log.debug('Find body block');
    let $listArticlesBlock = $body.find(this.listArticlesSelector);
    if ($listArticlesBlock.length === 0) {
      log.error(`Not found articles block; selector: ${this.listArticlesSelector}`);
      throw new Error('Not found articles block');
    }

    $listArticlesBlock = this.beforeGetArticles({ $listArticlesBlock });

    // get list articles
    log.debug('Find list articles block');
    let $listArticles = $listArticlesBlock.find(this.articleSelector);

    $listArticles = this.beforeParseListArticles({ $listArticles, listArticleObj });

    $listArticles.each(async (i, article) => {
      const $article = $(article);
      let articleObj = new Article();

      articleObj.setThumb(this.getThumbs({ $article }));
      const title = this.getTitle({ $article });
      articleObj.setTitle(title.title);
      articleObj.setUrl(title.url);
      articleObj.setExcerpt(this.getExcerpt({ $article }));

      listArticleObj.push(articleObj);
    });

    log.debug('Start get full content');
    for (let i = 0; i < listArticleObj.length; i++) {
      const articleObj = listArticleObj[i];
      const content = await this.getContent({ articleUrl: articleObj.url });
      articleObj.setContent(content);
      articleObj.setCategory(cate);
    }

    return {
      category: cate,
      listArticleObj
    };
  }

  /**
   * Save data to db
   * @param data {object} the result of article method
   * @returns {Promise.<void>}
   */
  save = async (data) => {
    await data.category.save();
    for (let i = 0; i < data.listArticleObj.length; i++) {
      await data.listArticleObj[i].save();
    }
  }
}


export default Parser;
