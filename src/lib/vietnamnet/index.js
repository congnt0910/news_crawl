import Base from '../core/Parser';

class Vietnamenet extends Base {
  constructor () {
    super({
      host: 'http://vietnamnet.vn',
      listArticlesSelector: 'ul.ListArticle',
      articleSelector: 'li',
      thumbSelector: 'img.thumb',
      titleSelector: 'a.title',
      excerptSelector: 'p.Lead.m-t-5',
      contentSelector: '#ArticleContent'
    });
  }

}

export default Vietnamenet;

