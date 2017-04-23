import Parser from './Parser';


try {
  const obj = new Parser({
    host: 'http://dantri.com.vn',
    listArticlesSelector: '.fl.wid470',
    articleSelector: '.mt3.clearfix',
    thumbSelector: 'a > img',
    titleSelector: '.mr1 > h2 > a',
    excerptSelector: '.fon5.wid324.fl, .fon5.wid255.fl',
    contentSelector: '#divNewsContent'
  });
  obj.articles({ path: 'suc-manh-so.htm', name: 'Sức mạnh số' })
    .then(listArticles => console.log(JSON.stringify(listArticles, null, 4)))
    .catch(e=> console.log(e));


}catch (e){
  console.error(e);
}
