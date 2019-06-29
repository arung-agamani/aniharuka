// Var
const TitleFeedArray = new Array();
const TitleResultArray = new Array();
let foundItemIndex = new Array();
const filteredFeedItems = new Array();
let minimumLength;

// Functions
module.exports = {
	foundItemIndex: foundItemIndex,
	TitleFeedArray: TitleFeedArray,
	filteredFeedItems: filteredFeedItems,
	minimumLength: minimumLength,
	TitleResultArray: TitleResultArray,
	compareArrays: function(result, feeds, callback) {
		let amountOfSameItems = 0;
		TitleFeedArray.length = 0;
		TitleResultArray.length = 0;
		foundItemIndex.length = 0;
		// console.log('Result Array Length : ' + result.length);
		// console.log('Feed Array Length : ' + feeds.length);
		if (result.length < feeds.length && result.length >= 5) {
			minimumLength = 5;
			// console.log('Minimum Length has determined : ' + minimumLength);
		}
		else if (result.length > feeds.length) {
			minimumLength = feeds.length;
			// console.log('Minimum Length has determined : ' + minimumLength);
		}
		else if (result.length < feeds.length && result.length < 5) {
			minimumLength = 5;
			// console.log('Minimum Length has determined : ' + minimumLength);
		}
		else if (result.length < feeds.length) {
			minimumLength = 5;
			// console.log('Minimum Length has determined : ' + minimumLength);
		}
		else if (result.length > 5 && feeds.length > 5) {
			minimumLength = 5;
			// console.log('Minimum Length has determined : ' + minimumLength);
		}
		for (let i = 0; i < minimumLength; i++) {
			// const title = feeds[i].title;
			// console.log(title);
			TitleFeedArray.push(feeds[i].title);
		}
		for (let i = 0; i < result.length; i++) {
			TitleResultArray.push(result[i].title);
		}
		console.log('Finish unwrapping arrays into internal local arrays');
		for (let j = 0; j < minimumLength; j++) {
			if (TitleResultArray.includes(TitleFeedArray[j])) {
				// console.log('Object #' + (j + 1) + ' was found in the internalResultArray');
				amountOfSameItems++;
				// console.log('Amount of same items now : ' + amountOfSameItems);

			}
			else {
				// console.log('Object #' + (j + 1) + ' was not found in the internalResultArray');
				foundItemIndex.push(j);
			}
		}
		console.log('Amount of found items : ' + amountOfSameItems);
		if (amountOfSameItems !== minimumLength) {
			// console.log('There is/are (a) new item on the feed!');
			// console.log(foundItemIndex.length + ' new item(s)!');
			for (let k = 0; k < foundItemIndex.length; k++) {
				console.log('New item :' + TitleFeedArray[foundItemIndex[k]]);
			}
		}
		else if (amountOfSameItems === minimumLength) {
			foundItemIndex = [];
		}

		callback(foundItemIndex);
	},
};