'use strict';

const url = require('url');
const axios = require('axios');
const languages = require('./languages');
const utils = require('./utils');

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
function getTranslation(text, {from = 'auto', to = 'auto'}) {
  if (!text) {
    throw new Error('The text can not be empty');
  }

  for (const lang of [from, to]) {
    if (!languages.isSupported(from)) {
      throw new Error(`The language ${lang} is not supported`);
    }
  }

  const url = generateURL(text, {from, to});
  return utils.httpRetry(axios.get)(url)
    .then(res => {
      const {orig, trans} = res.data.sentences[0];
      const from = res.data.src;
      return {orig, trans, from, to};
    })
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
function generateURL(text, options) {
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
