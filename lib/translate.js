'use strict';

const url = require('url');
const axios = require('axios');
const languages = require('./languages');

/**
 * 
 * get translation from https://translate.googleapis.com
 * 
 * @param {String} text             source text
 * @param {Object} options        
 * @param {String} options.from     source language
 * @param {String} options.to       target language
 * @returns {Promise<Object>}
 */
function getTranslation(text, options) {
  if (!text) {
    throw new Error('The text can not be empty');
  }

  options = options || {};
  options.from = options.from || 'auto';
  options.to = options.to || 'auto';

  [options.from, options.to].forEach(lang => {
    if (!languages.isSupported(lang)) {
      throw new Error(`The language ${lang} is not supported`);
    }
  });

  const translateURL = createTranslateURL(text, options);

  return axios.get(translateURL)
    .then(response => {
      return {
        orig: response.data.sentences[0].orig,
        trans: response.data.sentences[0].trans,
        from: response.data.src,
        to: options.to
      };
    })
    .catch(err => {
      throw new Error(err.message);
    });
}

/**
 * 
 * generate url
 * 
 * @param {String} text 
 * @param {Object} options 
 * @param {String} options.from
 * @param {String} options.to
 * @returns {String}
 */
function createTranslateURL(text, options) {
  return url.format({
    protocol: 'https:',
    hostname: 'translate.googleapis.com',
    pathname: '/translate_a/single',
    query: {
      client: 'gtx',
      ie: 'UTF-8',
      oe: 'UTF-8',
      dt: 't',
      dj: 1,
      sl: options.from,
      tl: options.to,
      q: text
    }
  });
}

module.exports = getTranslation;
