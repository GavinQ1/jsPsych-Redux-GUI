import * as actionTypes from '../constants/ActionTypes';

export const setExperimentNameAction = (name) => ({
	type: actionTypes.SET_EXPERIMENT_NAME,
	name: name,
});

export function setJspyschInitAction(key, value) {
	return {
		type: actionTypes.SET_JSPSYCH_INIT,
		key: key,
		value: value,
	};
}

export function setOsfParentNodeAction(value) {
	return {
		type: actionTypes.SET_OSF_PARENT,
		value: value
	}
}

export function setCloudSaveDataAfterAction(index) {
	return {
		type: actionTypes.SET_CLOUD_SAVE_DATA_AFTER,
		index: index
	}
}