'use strict';

const chalk = require('chalk');
const Spinner = require('cli-spinner').Spinner;
const isChinese = require('is-chinese')
const getTranslation = require('./translate');

const text = process.argv[2];
if (!text) {
  console.log('Please enter the text to be translated');
  process.exit(1);
}

let targetLang;
if (process.argv[3] === '-t' && process.argv[4]) {
  targetLang = process.argv[4];
}

const color = 'white';
const spinner = new Spinner('%s');
spinner.setSpinnerString('|/-\\');
spinner.start();

getTranslation(text, {to: targetLang})
  .then(result => {
    spinner.stop(true);

    // if (result.trans === text) {
    //   console.log('Cannot translate the text');
    //   process.exit(1);
    // }

    console.log(chalk.keyword(color)(result.trans));
  })
  .catch((err) => {
    spinner.stop(true);
    console.log(err);
    console.log('Cannot translate now, an error occurred');
  });
