// Library
const zlib = require('zlib');
const feedparser = require('feedparser');
const request = require('request');

// Variables


// Functions
module.exports = {
	GetFeed: function(urlFeed, callback) {
		const req = request(urlFeed);
		const feedItems = new Array();
		req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
		req.setHeader('accept', 'text/html,application/xhtml+xml');
		const fp = new feedparser('normalize');

		req.on('error', (error) => {
			console.log(error);
		});

		req.on('response', (res) => {
			if (res.statusCode !== 200) {
				console.log('Error in retrieving RSS data');
				console.log('Status code : ' + res.statusCode);
			}
			const encoding = res.headers['content-encoding'] || 'identity';
			res = Decompress(res, encoding);
			res.pipe(fp);
		});

		fp.on('error', (error) => {
			console.log(error);
			callback(error);
		});

		fp.on('readable', () => {
			const item = fp.read();
			if (item !== null) {
				// console.log('Current feedItems length : ' + feedItems.length);
				feedItems.push(item);
			}
			callback(false, feedItems);
		});
	},
};

function Decompress(result, encoding) {
	let decompress;

	if (encoding.match(/\bdeflate\b/)) {
		decompress = zlib.createInflate();
	}
	else if (encoding.match(/\bgzip\b/)) {
		decompress = zlib.createGunzip();
	}

	return decompress ? result.pipe(decompress) : result;
}

