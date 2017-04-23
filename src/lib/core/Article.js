import { removeDiacritics } from '../../helper/index';
import articleModel from '../../models/article';
// helper
import Logger from '../../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class Article {
  constructor () {
    this.url = null;
    this.title = null;
    this.alias = null;
    this.thumb = null;
    this.excerpt = null;
    this.content = null;
    this.category = null;
  }

  setUrl = (url) => {
    this.url = url;
  };

  setTitle = (title) => {
    this.title = title;
    this.alias = removeDiacritics(title);
  };

  setThumb = (thumb) => {
    this.thumb = thumb;
  };

  setExcerpt = (excerpt) => {
    this.excerpt = excerpt;
  };

  setContent = (content) => {
    this.content = content;
  };

  setCategory = (category) => {
    this.category = category;
  };

  toObject = () => {
    return {
      title: this.title,
      thumb: this.thumb,
      excerpt: this.excerpt,
      content: this.content
    };
  };

  save = async () => {
    log.debug(`START SAVE ARTICLE: ${this.title}`);
    await articleModel.save(this);
  }
}


export default Article;
