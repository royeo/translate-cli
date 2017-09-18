'use strict';

const chalk = require('chalk');
const Spinner = require('cli-spinner').Spinner;
const isChinese = require('is-chinese')
const getTranslation = require('./translate');

const text = process.argv.slice(2)[0];
if (!text) {
  console.log('Please enter the text to be translated');
  process.exit(1);
}

const spinner = new Spinner('翻译中... %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

const color = 'white';
const logPattern = '\n  %s\n\n  %s\n';
const targetLang = isChinese(text) ? 'en' : 'zh-cn';

getTranslation(text, {to: targetLang})
  .then(result => {
    spinner.stop(true);

    if (result.trans === text) {
      console.log('Cannot translate the text');
      process.exit(1);
    }

    console.log(logPattern,
      chalk.keyword(color)(text),
      chalk.keyword(color)(result.trans));
  })
  .catch(() => {
    spinner.stop(true);
    console.log('Cannot translate now, an error occurred');
  });
