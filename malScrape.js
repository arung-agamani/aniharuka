/* eslint-disable brace-style */
const request = require('request-promise');
const ch = require('cheerio');

Object.prototype.hasOwnProperty = function(property) {
	return typeof this[property] !== 'undefined';
};

const MAL_AnimeObject = {
    'title' : 'Not available',
    'poster_img' : 'Not available',
    'synopsis' : 'Not available',
    'score' : 'Not available',
    'media_type' : 'Not available',
    'episodes' : 'Not available',
    'airing_status' : 'Not available',
    'airing_period' : 'Not available',
    'season' : 'Not available',
    'broadcast' : 'Not available',
    'producers' : 'Not available',
    'licensors' : 'Not available',
    'studio' : 'Not available',
    'source' : 'Not available',
    'genres' : 'Not available',
    'duration' : 'Not available',
	'rating' : 'Not available',
	'charaVA' : [],
	'opening' : [],
	'ending' : [],
};

const MAL_MovieObject = {
    'title' : 'Not available',
    'poster_img' : 'Not available',
    'synopsis' : 'Not available',
    'score' : 'Not available',
    'media_type' : 'Not available',
    'episodes' : 'Not available',
    'airing_status' : 'Not available',
    'airing_period' : 'Not available',
    'producers' : 'Not available',
    'licensors' : 'Not available',
    'studio' : 'Not available',
    'source' : 'Not available',
    'genres' : 'Not available',
    'duration' : 'Not available',
	'rating' : 'Not available',
	'charaVA' : [],
};

function seasonalAnimeList(link) {
    request(link)
        .then(data => {
            const title_array = ch('a.link-title', data).toArray();
            // const synopsis_array = ch('div.synopsis', data).toArray();
            const studio_array = ch('div.prodsrc > span > a', data).toArray();
            const eps_array = ch('div.eps > a > span', data).toArray();
            // const source_array = ch('span.source', data).toArray();
            for (let i = 0; i < 5; i++) {
                console.log('=================');
                console.log(title_array[i].children[0].data);
                console.log(studio_array[i].children[0].data);
                console.log('Episode : ' + eps_array[i].children[0].data);
                // console.log('Synopsis : ' + synopsis_array[i].children[0].next.children[0].data);
                // console.log(synopsis_array[i].children[0].next.children[0].data);
            }
        })
        .catch((err) => {
            return err;
        });
}

function animeSearch(keyword) {
    // perform search query on MAL
    const base_link = 'https://myanimelist.net/anime.php?q=';
    let query;
    if (keyword.match(/\s/)) {
        query = keyword.split(' ').join('%20');
    }
    else {
        query = keyword;
	}
	
	return new Promise((resolve, reject) => {
		request(base_link + query)
        .then(data => {
            console.log(base_link + query);
            // Check if result exist. Take the result more than 0
            // Its a table
            const tableRes = ch('div.list > table > tbody > tr > td > a > strong', data).toArray();
            if (tableRes.length > 0) {
				const titleRes = ch('td.borderClass > a.hoverinfo_trigger', data);
                const synopsisRes = ch('td.borderClass > div.pt4', data);
                const typeRese = ch('div.list > table > tbody > tr > td:nth-child(3)', data);
                const EpsRes = ch('div.list > table > tbody > tr > td:nth-child(4)', data);
                const rateRes = ch('div.list > table > tbody > tr > td:nth-child(5)', data);
                const mainLink = ch('div.list > table > tbody > tr > td > div.picSurround > a', data);
				const expArr = new Array();
				for (let i = 0; i < 5; i++) {
					const obj = {
						title : titleRes[i].children[0].children[0].data,
						synopsis : synopsisRes[i].children[0].data,
						type : typeRese[i].children[0].data,
						epsCount : EpsRes[i].children[0].data,
						rating : rateRes[i].children[0].data,
						link : mainLink[i].attribs.href,
					};
					expArr.push(obj);
				}
				resolve(expArr);
            }
            else {
                console.log('No result found, :<');
            }
        })
        .catch(err => {
			console.log(err);
			reject(err);
        });
	}
	);
    
}

function searchAndNavigate(keyword, flag = 'TV') {
	let function_status = 'not done';
    const base_link = 'https://myanimelist.net/anime.php?q=';
    let query;
    if (keyword.match(/\s/)) {
        query = keyword.split(' ').join('%20');
    }
    else {
        query = keyword;
    }
    return new Promise((resolve, reject) => {
    // console.log('Fetching data using \'Not available' + keyword + '\' as search query.');
		request(base_link + query)
			.then((initResponse) => {
				let idx = 0;
				let matchFlag = 'TV';
				const typeRes = ch('div.list > table > tbody > tr > td:nth-child(3)', initResponse).toArray();
				const mainLink = ch('div.list > table > tbody > tr > td > div.picSurround > a', initResponse).toArray();
				// Switch case for the flag
				if (flag.match(/TV/i)) {
					matchFlag = 'TV';
				} else if (flag.match(/Movie/i)) {
					matchFlag = 'Movie';
				} else if (flag.match(/OVA/i)) {
					matchFlag = 'OVA';
				} else if (flag.match(/ONA/i)) {
					matchFlag = 'ONA';
				} else if (flag.match(/Special/i)) {
					matchFlag = 'Special';
				} else {
					matchFlag = 'TV';
				}

				//
				for (let i = 1; i <= typeRes.length; i++) {
					if (typeRes[i].children[0].data.trim() == matchFlag) {
						idx = i;
						break;
					}
				}
				const targetLink = mainLink[idx - 1].attribs.href;
				console.log('Piping search into link : ' + targetLink);
				request(targetLink)
				.then((mainData) => {
					const title = ch('h1.h1 > span', mainData).toArray();
					const score = ch('div.score', mainData).text().trim();
					const poster_img = ch('div.js-scrollfix-bottom > div > a > img', mainData).attr('src');
					const synopsis = ch('div.js-scrollfix-bottom-rel > table > tbody > tr:nth-child(1) > td > span', mainData).text().trim();
					const openingTheme = ch('div.opnening > span.theme-song', mainData);
					const endingTheme = ch('div.ending > span.theme-song', mainData);
					const main_chara_va_table = ch('div.detail-characters-list', mainData).first();
					const leftChara = main_chara_va_table.find('.fl-l > table > tbody > tr > td > a');
					const rightChara = main_chara_va_table.find('.fl-r > table > tbody > tr > td > a');
					const left_VA = main_chara_va_table.find('.fl-l > table > tbody > tr > td > table > tbody > tr > td > a');
					const right_VA = main_chara_va_table.find('.fl-r > table > tbody > tr > td > table > tbody > tr > td > a');

					const chara_VA_pair_Array = new Array();
					const charArray = new Array();
					  const vaArray = new Array();
					const opThemeArr = new Array();
					const edThemeArr = new Array();
					openingTheme.each((i, elmt) => {
						opThemeArr.push(ch(elmt).text());
					});
					endingTheme.each((i, elmt) => {
						edThemeArr.push(ch(elmt).text());
					});
					leftChara.each((i, elmt) => {
						charArray.push(ch(elmt).text());
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

					for (let i = 0; i < charArray.length; i++) {
						chara_VA_pair_Array.push({
							char : charArray[i],
							va : vaArray[i],
						});
					}

					const info_panel = ch('#content > table > tbody > tr > td.borderClass > div > h2:nth-of-type(2)', mainData).nextUntil('br').toArray();
					
					if (matchFlag == 'TV') {
						const obj = MAL_AnimeObject;
						const genre_array = new Array();
						for (let i = 3; i < info_panel[10].children.length; i = i + 2) {
							genre_array.push(info_panel[10].children[i].children[0].data.trim());
						}
						obj.title = title[0].children[0].data;
						obj.poster_img = poster_img;
						obj.score = score;
						obj.synopsis = synopsis;
						obj.media_type = info_panel[0].children[3].children[0].data.trim();
						obj.episodes = info_panel[1].children[2].data.trim();
						obj.airing_status = info_panel[2].children[2].data.trim();
						obj.airing_period = info_panel[3].children[2].data.trim();
						obj.season = info_panel[4].children[3].children[0].data.trim();
						obj.broadcast = info_panel[5].children[2].data.trim();
						obj.producers = info_panel[6].children[3].children[0].data.trim();
						// obj.licensors = info_panel[7].children[3].children[0].data.trim();
						obj.studio = info_panel[8].children[3].children[0].data.trim();
						obj.source = info_panel[9].children[2].data.trim();
						obj.genres = genre_array.toString();
						// obj.duration = info_panel[11].children[2].data.trim();
						obj.rating = info_panel[12].children[2].data.trim();
						obj.charaVA = chara_VA_pair_Array;
						obj.opening = opThemeArr;
						obj.ending = edThemeArr;
						function_status = 'done';
						// APP PIPELINE STARTS HERE
						resolve(obj);
					} else if (matchFlag == 'Movie' || matchFlag == 'Special' || matchFlag == 'ONA' || matchFlag == 'OVA') {
						const obj = MAL_MovieObject;
						const genre_array = new Array();
						for (let i = 3; i < info_panel[8].children.length; i = i + 2) {
							genre_array.push(info_panel[8].children[i].children[0].data.trim());
						}
						obj.title = title[0].children[0].data;
						obj.poster_img = poster_img;
						obj.score = score;
						obj.synopsis = synopsis;
						obj.media_type = info_panel[0].children[3].children[0].data.trim();
						obj.episodes = info_panel[1].children[2].data.trim();
						obj.airing_status = info_panel[2].children[2].data.trim();
						obj.airing_period = info_panel[3].children[2].data.trim();
						obj.producers = info_panel[4].children[3].children[0].data.trim();
						// obj.licensors = info_panel[5].children[3].children[0].data.trim();
						obj.studio = info_panel[6].children[3].children[0].data.trim();
						obj.source = info_panel[7].children[2].data.trim();
						obj.genres = genre_array.toString();
						// obj.duration = info_panel[9].children[2].data.trim();
						obj.rating = info_panel[10].children[2].data.trim();
						function_status = 'done';
						// APP PIPELINE STARTS HERE
						resolve(obj);
					}
				})
				.catch(err => {
					console.log(err);
					function_status = 'error';
					reject(function_status);
				});
			})
			.catch(err => {
				console.log(err);
				function_status = 'error';
				reject(function_status);
		});
	});
}

module.exports.malSearchAndNav = async function(search_string, flags = 'TV') {
	const promiseResponse = await searchAndNavigate(search_string, flags);
	return promiseResponse;
};

module.exports.search = async function(searchString) {
	const promiseResponse = await animeSearch(searchString);
	return promiseResponse;
}