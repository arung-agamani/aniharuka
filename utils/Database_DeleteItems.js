const PostGres = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const pg = new PostGres.Client(postgresURL);

/**
 * Delete Items on PostreSQL Database
 * Triggered when item exceeds 50
 */

pg.connect();

module.exports = {
	deleteRows: function() {
		const MinValue = 'SELECT MIN(urutan) as smallestOrder FROM horrisubsrss;';
		pg.query(MinValue, (err, minVal) => {
			if (err) {
				console.log('Error on retrieving the minimum value of the database : ', err);
			}
			else {
				const smallestCount = minVal.rows;
				console.log('Retrieving minimum value ' + smallestCount[0].smallestorder);
				const DeleteQuery = 'DELETE FROM horrisubsrss WHERE urutan <= ' + (smallestCount[0].smallestorder + 10) + ';';
				pg.query(DeleteQuery, (err, result) => {
					if (err) {
						console.log('Error happened on Database_DeleteItems.js, on deleteRows function : ', err);
					}
					else {
						console.log('Query successful! 10 items were deleted from horrisubsrss');
						console.log('Database length now : ' + result.rowCount);
						console.log('deleteRow function was called');

						for (let i = 0; i < result.rowCount; i++) {
							const Update_Query = 'UPDATE horrisubsrss SET urutan=' + (i + 1) + ' WHERE urutan=' + (smallestCount[0].smallestorder + i) + '';
							pg.query(Update_Query, (err, updateResult) => {
								if (err) {
									console.log(err);
								}
								else {
									console.log('Item updated on urutanItem : ' + (smallestCount[0].smallestorder + i));
								}
							});
						}
					}
				});


			}
		});
	},
};