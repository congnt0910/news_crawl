/**
 * Store information to start a job crawl data
 */
class Job {
  /**
   *
   * @param agent {string} the api name in lib. e.g.: dantri, vietbao ...
   * @param path {string} the uri to crawl. can be a path of url of full url. protocol://host/path
   * @param name {string} category name
   */
  constructor ({agent, path, name}){
    this.agent = agent; //
    this.path = path;
    this.name = name;
  }
}

export default Job;
