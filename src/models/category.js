import store from './store';
// helper
import Logger from '../helper/logger';

const log = new Logger(__filename); // eslint-disable-line no-unused-vars

const preKey = 'category';
const prefix = {
  index: `${preKey}:index:`,
  hash: `${preKey}:hash`,
};

const checkExist = async (alias) => {
  return await store.getClient().hexistsAsync([prefix.hash, alias]);
};

const save = async (catetory) => {
  try {
    // check key exist
    const keyExist = await checkExist(catetory.alias);
    if (keyExist) {
      log.info(`Skipped save category - Key exist: ${catetory.alias}  ~ ${catetory.name}`);
      return true;
    }
    const hsetArgs = [prefix.hash, catetory.alias, catetory.name];
    await store.getClient().hsetAsync(hsetArgs);
    return true;
  } catch (e) {
    log.error(e);
    throw e;
  }
};

const getAll = async () => {
  try {
    return await store.getClient().hgetallAsync();
  } catch (e) {
    log.error(e);
    throw e;
  }
};

export default {
  save,
  getAll
};
