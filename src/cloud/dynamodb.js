/**
 * @file This file defines the wrapped methods of AWS-DynamoDB and helpers for storing data to dynamoDB.
*/

import { AWS } from './index.js';

const API_VERSION = '2012-08-10';
const User_Table_Name = "jsPsych_Builder_Users";
const Experiment_Table_Name = "jsPsych_Builder_Experiments";

/**
* Construct a DynamoDB document client
* @return - A DynamoDB document client
*/
function connectDynamoDB() {
	return new(AWS.DynamoDB.DocumentClient)({
		apiVersion: API_VERSION,
	});
}

/**
* Promise wrapper function of dynamoDB.put
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function putItem(param) {
	return connectDynamoDB().put(param).promise();
}

/**
* Promise wrapper function of dynamoDB.get
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function getItem(param) {
	return connectDynamoDB().get(param).promise();
}

/**
* Promise wrapper function of dynamoDB.delete
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function deleteItem(param) {
	return connectDynamoDB().delete(param).promise();
}

/**
* Promise wrapper function of dynamoDB.scan
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function scanItem(param) {
	return connectDynamoDB().scan(param).promise();
}

/**
* Wrapper function that put item to user table
* @param {Object} data - Item to be put. (return value of extractUserData)
* @return {Promise} - A Promise that resolves if success
*/
function putItemToUserTable(data) {
	let param = {
		TableName: User_Table_Name,
		Item: {
			...data
		},
		ReturnConsumedCapacity: "TOTAL",
	};

	return putItem(param);
}

/**
* Wrapper function that put item to experiment table
* @param {Object} data - Item to be put. (return value of extractExperimentData)
* @return {Promise} - A Promise that resolves if success
*/
function putItemToExperimentTable(data) {
	let param = {
		TableName: Experiment_Table_Name,
		Item: {
			...data
		},
		ReturnConsumedCapacity: "TOTAL",
	}

	return putItem(param);
}

/**
* Process the userState so that it is ready to be put into User Table
* @param {Object} userState - userState from reduex
* @return {Object} - Key-Value pairs that map the design of user table
*/
function extractUserData(userState) {
	return {
		userId: userState.userId,
		username: userState.username,
		fetch: userState
	};
}

/**
* Process the experimentState so that it is ready to be put into Experiment Table
* @param {Object} experimentState - experimentState from reduex
* @return {Object} - Key-Value pairs that map the design of experiment table
*/
function extractExperimentData(experimentState) {
	return {
		experimentId: experimentState.experimentId,
		fetch: experimentState,
		ownerId: experimentState.ownerId,
		isPublic: experimentState.isPublic,
		createDate: experimentState.createDate,
		lastModifiedDate: experimentState.lastModifiedDate
	};
}

/**
* Wrapper function that fetch user data
* @param {string} id - user's identity id
* @return {Promise} - A Promise that resolves to DynamoDB response if success
*/
export function getUserDate(id) {
	let param = {
		TableName: User_Table_Name,
		Key: {
			'userId': id,
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param);
}

/**
* Wrapper function that fetch experiment data by id
* @param {string} id - experiment id
* @return {Promise} - A Promise that resolves to DynamoDB response if success
*/
export function getExperimentById(id) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			'experimentId': id
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param);
}

/**
* Wrapper function that fetch experiments by userid
* @param {string} id - user id
* @return {Promise} - A Promise that resolves to an array of experiments owned by targeted user (userId) if success
*/
export function getExperimentsOf(userId) {
	let param = {
		TableName: Experiment_Table_Name,
		FilterExpression: "#ownerId = :ownerId",
		ExpressionAttributeNames: {
			"#ownerId": "ownerId"
		},
		ExpressionAttributeValues: {
			":ownerId": userId
		}
	};
	return scanItem(param).then(data => {
		let { Items } = data;
		return Items.map(item => item.fetch);
	});
}

/**
* Wrapper function that fetch an experiments by userid and largest last modified date
* @param {string} id - user id
* @return {Promise} - A Promise that resolves to last modified experiment of targeted user (userId) if success
*/
export function getLastModifiedExperimentOf(userId) {
	return getExperimentsOf(userId).then(experiments => {
		let res = null, max = 0;
		for (let experiment of experiments) {
			if (experiment.lastModifiedDate > max) {
				max = experiment.lastModifiedDate;
				res = experiment;
			}
		}
		return res;
	});
}

/**
* Wrapper function that put userState to User Table
* @param {Object} userState - userState from redux
* @return {Promise} - A Promise that resolves if success
*/
export function saveUserData(userState) {
	return putItemToUserTable(extractUserData(userState));
}

/**
* Wrapper function that put experimentState to Experiment Table
* @param {Object} experimentState - experimentState from redux
* @return {Promise} - A Promise that resolves if success
*/
export function saveExperiment(experimentState) {
	return putItemToExperimentTable(extractExperimentData(experimentState));
}


/**
* Wrapper function that delete an experiment from Experiment Table
* @param {string} experimentId - the id of the experiment to be deleted 
* @return {Promise} - A Promise that resolves if success
*/
export function deleteExperiment(experimentId) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			experimentId: experimentId
		}
	}
	return deleteItem(param);
}
