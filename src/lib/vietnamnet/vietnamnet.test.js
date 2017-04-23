
import Vietnamnet from './index';
import helper from '../../helper/index';
import articleModel from '../../models/article';

helper.sleep(3000)
  .then(() => {
    const obj = new Vietnamnet();
    return obj.articles({ path: '/vn/bat-dong-san/', name: 'Bất động sản' })
      .then(listArticles => {
        console.log(JSON.stringify(listArticles, null, 4));
        return listArticles;
      })
      .then(listArticles => {
        // save to redis
        return obj.save(listArticles);
      })
      .then(() => {
        console.log('Done!!!!');
      });
  })
  .then(() => {
    return articleModel.listArticles({from: 0,  limit: 2})
      .then(rs => {
        console.log(rs);
      });
  })
  .then(() => {
    return articleModel.listArticles({from: 2,  limit: 2})
      .then(rs => {
        console.log(rs);
      });
  })
  .then(() => {
    return articleModel.listArticleByCate({from: 2,  limit: 5, cate: helper.removeDiacritics('Bất động sản') })
      .then(rs => {
        console.log(rs);
      });
  })
  .then(() => {
    process.exit(0);
  })
  .catch(e => console.log(e));

