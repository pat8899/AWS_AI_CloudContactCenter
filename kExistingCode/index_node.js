const AWS = require('aws-sdk');

// Language
const messages = {
	genericError: 'Sorry, an error occurred',
	invalidUser: 'Sorry, you have provided an invalid name',
	hazardsFound: (site, text) => `The following hazards have been logged for site ${ site }: ${ text }`,
	noHazardsFound: site => `Could not find any hazards data for site: ${ site }`
};

/**
 * A helper function to remove whitespace and capital letters
 * @param  {String} s The original text
 * @return {String}
 */
const cleanString = s => s.replace(/\W/g, '').toLowerCase(); // Some Name - Some Org => somenamesomeorg

/**
 * Checks for a user in the user store
 * @param  {String}  user      The raw user name
 * @return {Promise}
 */
const checkUser = async (user) => {
	return true;
	/**
	const dynamodb = new AWS.DynamoDB();
	const params = {
		Key: {
			"name": {
				S: cleanString(user)
			}
		},
		TableName: process.env.TABLE
	};
	const { Item: item } = await dynamodb.getItem(params).promise();
	if (item) return true;
	return false;
	**/
};

/**
 * Queries for a hazard data file in S3 and returns the message if one is found.
 * @param  {String}  site   The site name
 * @param  {Object}  s3     An S3 client
 * @param  {String}  bucket The data bucket name
 * @param  {Object}  logger A logger object
 * @return {Promise}
 */
const getHazards = async (site) => {
	return messages.hazardsFound('Waiatarua', 'example hazard 1, example hazard 2');
	/**
	const s3 = new AWS.S3();
	const params = {
		Bucket: process.env.BUCKET,
		Key: `data/${ cleanString(site) }.json`
	};
	try {
		const { Body: buffer }  = await s3.getObject(params).promise();
		const { text } = JSON.parse(buffer.toString());
		return messages.hazardsFound(site, text);
	} catch (e) {
		console.log(JSON.stringify({error: e, params}));
	}
	return messages.noHazardsFound(site);
	**/
}

/**
 * Main handler function
 * @param  {Object}  event An S3 event
 * @return {Promise}
 */
exports.handler = async (event) => {
	
	const { currentIntent } = event;

	// Other vars
	let fulfillmentState = 'Failed';
	let messageContent = messages.genericError;

	// Verify the user
	const { slots: { user, site } } = currentIntent;
	const valid = await checkUser(user);

	// If the user is valid, fetch hazards
	if (!valid) {
		messageContent = messages.invalidUser;
	} else {
		messageContent = await getHazards(site);
		fulfillmentState = 'Fulfilled'
	}

	// Return a Lex object
	return {
		dialogAction: {
			type: "Close",
			fulfillmentState,
			message: {
				contentType: "PlainText", // or SSML or CustomPayload"
				content: messageContent
			}
		}
	};
};
