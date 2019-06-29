function encode(input) {
	const buffer = new Buffer(input);
	const encoded = buffer.toString('base64');

	return encoded;
}

function decode(input) {
	const buffer = new Buffer(input, 'base64');
	const decoded = buffer.toString();

	return decoded;
}

module.exports = {
	encode: encode,
	decode: decode,
};