'use strict'

/**
 * http retry
 *
 * @param {function} fn
 * @param {number} [times=3]
 * @param {number} [delay=0]
 * @returns {*}
 */
function httpRetry(fn, times = 3, delay = 0) {
  return function request(...args) {
    return fn(...args).catch(err => {
      if (needRetry(err)) {
        if (times-- > 0) {
          return Promise.delay(delay).then(() => request(...args));
        } else {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(err);
      }
    });
  }
}

/**
 * determine whether it is a timeout exception
 *
 * @param {object} err
 * @returns {boolean}
 */
function needRetry(err) {
  const errMsg = err.toString().toLowerCase();
  return errMsg.includes('socket hang up')
    || errMsg.includes('timeout')
    || errMsg.includes('econnreset')
    || errMsg.includes('econnrefused')
    || errMsg.includes('etimedout');
}

exports.httpRetry = httpRetry;
