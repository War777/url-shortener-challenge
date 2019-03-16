const uuidv4 = require('uuid/v4');
const { domain } = require('../../environment');

const SERVER = `${domain.protocol}://${domain.host}`;

const UrlModel = require('./schema');
const parseUrl = require('url').parse;
const validUrl = require('valid-url');
const shortid = require('shortid');

/**
 * Lookup for existant, active shortened URLs by hash.
 * 'null' will be returned when no matches were found.
 * @param {string} hash
 * @returns {object}
 */
async function getUrl(hash) {
//   let source = await UrlModel.findOne({ active: true, hash });
    let source = await UrlModel.findOneAndUpdate({ active: true, hash }, { $inc: { visits: 1 } });
  return source;
}

/**
* Return existing documents (URLs) inside the current page
* and sends them back in the response
* @param {object} req
* @param {object} res
*/
getUrls = (req, res) => {
    
    var options = {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit)
    }

    UrlModel.paginate({}, options)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
}

/**
 * Generate an unique hash-ish- for an URL.
 * TODO: Deprecated the use of UUIDs.
 * TODO: Implement a shortening algorithm
 * @param {string} id
 * @returns {string} hash
 */
function generateHash(url) {
  // return uuidv5(url, uuidv5.URL);
  // return uuidv4();
  return shortid.generate();
}

/**
 * Generate a random token that will allow URLs to be (logical) removed
 * @returns {string} uuid v4
 */
function generateRemoveToken() {
  return uuidv4();
}

/**
 * Create an instance of a shortened URL in the DB.
 * Parse the URL destructuring into base components (Protocol, Host, Path).
 * An Error will be thrown if the URL is not valid or saving fails.
 * @param {string} url
 * @param {string} hash
 * @returns {object}
 */
async function shorten(url, hash) {

  if (!isValid(url)) {
    throw new Error('Invalid URL');
  }

  // Get URL components for metrics sake
  const urlComponents = parseUrl(url);
  const protocol = urlComponents.protocol || '';
  const domain = `${urlComponents.host || ''}${urlComponents.auth || ''}`;
  const path = `${urlComponents.path || ''}${urlComponents.hash || ''}`;

  // Generate a token that will alow an URL to be removed (logical)
  const removeToken = generateRemoveToken();

  // Create a new model instance
  const shortUrl = new UrlModel({
    url,
    protocol,
    domain,
    path,
    visits: 0,
    hash,
    shorten: `${SERVER}/${hash}`,  // Oscar added this field to store the shorten url
    isCustom: false,
    removeToken,
    active: true
  });

  // TODO: Handle save errors
  try{
    const saved = await shortUrl.save();
  } catch(e){
      throw new Error('Error saving the url');
  }
  

  return {
    url,
    shorten: `${SERVER}/${hash}`,
    hash,
    removeUrl: `${SERVER}/${hash}/remove/${removeToken}`
  };

}

/**
 * Validate URI
 * @param {any} url
 * @returns {boolean}
 */
function isValid(url) {
  return validUrl.isUri(url);
}

async function removeUrl(hash, removeToken) {
    
    let res = await UrlModel.deleteOne(
        { hash: hash, removeToken: removeToken }
    );

    return res;

}


module.exports = {
  shorten,
  getUrl,
  getUrls,
  generateHash,
  generateRemoveToken,
  removeUrl,
  isValid,

}
