/* eslint-disable quotes */
const mal = require('./malScrape');

mal.search('gintama').then(searchResArr => {
  const arr = new Array();
  for (const i of searchResArr) {
    console.log(i);
    arr.push(i.type);
  }
  console.log(arr);
});