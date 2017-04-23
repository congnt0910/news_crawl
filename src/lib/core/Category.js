import { removeDiacritics } from '../../helper/index';
import categoryModel from '../../models/category';
// helper
import Logger from '../../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

class Category {
  constructor ({ url, name }) {
    this.url = url;
    this.name = name;
    this.alias = removeDiacritics(name);
  }

  toObject = () => {
    return {
      name: this.name
    };
  };

  save = async () => {
    log.debug(`START SAVE CATEGORY: ${this.name}`);
    await categoryModel.save(this);
    return true;
  }
}


export default Category;

