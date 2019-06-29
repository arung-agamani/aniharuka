/* eslint-disable brace-style */
const request = require('request-promise');
const ch = require('cheerio');

async function retrieve(link) {
  console.log('Running function');
  request(link)
    .then((html) => {
      console.log('Data retrieved');
      const main_chara_va_table = ch('div.detail-characters-list', html).first();
      const leftChara = main_chara_va_table.find('.fl-l > table > tbody > tr > td > a');
      const rightChara = main_chara_va_table.find('.fl-r > table > tbody > tr > td > a');
      const left_VA = main_chara_va_table.find('.fl-l > table > tbody > tr > td > table > tbody > tr > td > a');
      const right_VA = main_chara_va_table.find('.fl-r > table > tbody > tr > td > table > tbody > tr > td > a');
      const charArray = new Array();
      const vaArray = new Array();
      const charImgLink = new Array();
      const charImgSrc = new Array();
      const obj = {
        container : [],
      };
      leftChara.each((i, elmt) => {
        charArray.push(ch(elmt).text());
        charImgLink.push(ch(elmt).attr('href'));
      });
      left_VA.each((i, elmt) => {
        vaArray.push(ch(elmt).text());
      });
      rightChara.each((i, elmt) => {
        charArray.push(ch(elmt).text());
      });
      right_VA.each((i, elmt) => {
        vaArray.push(ch(elmt).text());
      });
      // Retrieving raw image from each link
      // Do request to first element of charImgLink and print out the img href
      for (let iter = 0; iter < charImgLink.length; iter++) {
        request(charImgLink[iter])
          .then(htmlData => {
            const imgLink = ch('#content > table > tbody > tr > td.borderClass > div:nth-child(1) > a > img', htmlData).attr('src');
            console.log(imgLink);
            charImgSrc[iter] = imgLink;
          }).catch(err => { console.log(err); });
      }
      console.log(charImgSrc.length);


      // console.log(leftColumn);
      for (let i = 0; i < charArray.length; i++) {
        const intObj = {
          chara : charArray[i],
          va : vaArray[i],
        };
        obj.container.push(intObj);
      }
      console.log(obj.container);
    }).catch(err => { console.log(err); });
}


retrieve('https://myanimelist.net/anime/38472/Isekai_Quartet');