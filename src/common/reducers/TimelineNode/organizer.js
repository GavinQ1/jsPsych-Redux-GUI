/*
This file is the reducers for timelineNode class from jsPsych (timeline, trial)

A timeline state = {
	id: string,
	type: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string,
	childrenById: array,
	collapsed: boolean,
	enabled: boolean,
	// jsPsych timeline properties
	parameters: object,
}

A trial state = {
	id: string,
	type: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string,
	enabled: boolean,
	// specific parameters decided by which plugin user chooses
	parameters: object,
}

*/



import * as utils from './utils'; 
import { deepCopy } from '../../utils';

const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
const DEFAULT_TRIAL_NAME = 'Untitled Trial';
const DEFAULT_PLUGIN_TYPE = 'text';

var timeline = 0;
var trial = 0;


/**************************  Helper functions  ********************************/

var __TEST__ = 0;
export function enterTest() {
	__TEST__ = 1;
}

function getNodeById(state, id) {
	if (id === null)
		return null;
	return state[id];
}

const getDefaultTimelineName = () => {
	if (__TEST__)
		return DEFAULT_TIMELINE_NAME;
	return DEFAULT_TIMELINE_NAME + " " + (timeline++);
};
const getDefaultTrialName = () => {
	if (__TEST__)
		return DEFAULT_TRIAL_NAME;
	return DEFAULT_TRIAL_NAME + " " + (trial++);
};

export function createTimeline(id,
	parent=null,
	name=getDefaultTimelineName(),
	childrenById=[],
	collapsed=true,
	enabled=true,
	parameters={},
	timeline_variable=[{header1: 'value1', header2: 'value2'}]) {

	return {
		id: id,
		type: utils.TIMELINE_TYPE,
		name: name,
		parent: parent,
		childrenById: childrenById,
		collapsed: collapsed,
		enabled: enabled,
		parameters: parameters,
	};
}


export function createTrial(id,
	parent=null,
	name=getDefaultTrialName(),
	enabled=true,
	parameters={text: '', choices: ''},
	pluginType=DEFAULT_PLUGIN_TYPE) {

	return {
		id: id,
		type: utils.TRIAL_TYPE,
		name: name,
		parent: parent,
		enabled: enabled,
		parameters: parameters,
		pluginType: pluginType,
	};
}

export function createTable(id,
	timelineId,
	erId,
	rowId,
	cellValue={}) {

	return {
		id: id,
		timelineId: utils.getTimelineId(),
		headerId: utils.getHeaderId(),
		rowId: utils.getRowId(),
		cellValue: cellValue
	};
}


/*
action = {
	id: id,
	parent: string,
}
*/
export function addTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let id = action.id;
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = deepCopy(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: childrenById
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let timeline = createTimeline(id, action.parent)

	new_state[id] = timeline;

	return new_state;
}

/*
action = {
	id: string,
	parent: string,
}
*/
export function addTrial(state, action) {
	let new_state = Object.assign({}, state);

	let id = action.id;
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = deepCopy(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: main timeline
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let trial = createTrial(id, action.parent)

	new_state[id] = trial;
	return new_state;
}

export function insertNodeAfterTrial(state, action) {
	let targetParent = state[action.targetId].parent;
	let new_state;

	// if inserted node is a timeline
	if (action.isTimeline) {
		new_state = addTimeline(state, {id: action.id, parent: targetParent});
	// if it is a trial
	} else {
		new_state = addTrial(state, {id: action.id, parent: targetParent});
	}

	let arr;
	if (targetParent === null) {
		arr = new_state.mainTimeline;
	} else {
		arr = new_state[targetParent].childrenById;
	}

	// move source after target
	arr.move(arr.indexOf(action.id), arr.indexOf(action.targetId)+1);

	return new_state;
}

function deleteTimelineHelper(state, id) {
	let timeline = getNodeById(state, id);

	// delete its children
	timeline.childrenById.map((childId) => {
		if (utils.isTimeline(state[childId])) {
			state = deleteTimelineHelper(state, childId);
		} else {
			state = deleteTrialHelper(state, childId)
		}
	});

	// delete itself
	let parent = timeline.parent;
	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent =  getNodeById(state, parent)
		parent = deepCopy(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}
	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/*
action = {
	id: string
}
*/
export function deleteTimeline(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTimelineHelper(new_state, action.id);
}

function deleteTrialHelper(state, id) {
	let trial = getNodeById(state, id);
	let parent = trial.parent;

	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent = getNodeById(state, parent);
		parent = deepCopy(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}

	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/*
action = {
	id: string
}
*/
export function deleteTrial(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTrialHelper(new_state, action.id);
}

function duplicateTimelineHelper(state, dupId, targetId, getTimelineId, getTrialId) {

	// find target
	let target = state[targetId];
	// deep copy it but with different id
	let dup = deepCopy(target);
	dup.id = dupId;

	// clear dup children array
	dup.childrenById = [];
	// populate it
	let dupTargetId;
	let dupTarget;
	let dupChild;
	let newId;
	for (let i = 0; i < target.childrenById.length; i++) {
		dupTargetId = target.childrenById[i];
		dupTarget = state[dupTargetId];
		// if this descendant is a timeline, call duplicate recusively to
		// reach all nodes
		if (utils.isTimeline(dupTarget)) {
			newId = getTimelineId();
			dupChild = duplicateTimelineHelper(state, newId, dupTargetId, getTimelineId, getTrialId);
		// if this descendant is a trial, simply duplicated it
		} else {
			newId = getTrialId();
			dupChild = deepCopy(dupTarget);
		}

		// add dup child to dup and state
		dup.childrenById.push(newId);
		state[newId] = dupChild;
		// have its own id and parent
		dupChild.id = newId;
		dupChild.parent = dupId;
	}

	return dup;
}

/*
action = {
	dupId: id, // assigned id
	targetId: id, // target to be copyed 
}
*/
export function duplicateTimeline(state, action) {
	const { dupId, targetId, getTimelineId, getTrialId } = action;

	let new_state = Object.assign({}, state);

	// duplicate
	let dup = duplicateTimelineHelper(new_state, dupId, targetId, getTimelineId, getTrialId);
	new_state[dup.id] = dup;
	let target = state[targetId];
	let parent = target.parent;

	// push behind target
	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = deepCopy(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}
	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
}

/*
action = {
	dupId: id, // assigned id
	targetId: id, // target to be copyed 
}
*/
export function duplicateTrial(state, action) {
	const { dupId, targetId } = action;

	let target = state[targetId];
	let parent = target.parent;

	// duplicate
	let new_state = Object.assign({}, state);
	let dup = deepCopy(target);
	// get its own id
	dup.id = dupId;
	new_state[dupId] = dup;

	// push behind target
	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = deepCopy(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}
	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
} 

/*
See if source is an ancestor of target
*/
function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);

	while (target && target.parent !== null) {
		if (target.parent === sourceId)
			return true;
		target = state[target.parent];
	}

	return false;
}

/*
Move source to a wanted position in the tree. 
Either right at or one slot behind the original node at that pos.
action = {
	sourceId: id, // source
	targetId: id, // target
}
*/
export function moveTo(state, action) {
	// can't move if
	// 1. it is moving to itself
	// 2. self or target is null
	// 3. Ancestor to descendant
	if (action.sourceId === action.targetId ||
		!action.sourceId ||
		!action.targetId ||
		isAncestor(state, action.sourceId, action.targetId))
		return state;
	
	let source = state[action.sourceId];
	let target = state[action.targetId];

	// get new state
	let new_state = Object.assign({}, state);
	// replace old source with a new deep copied source
	new_state[source.id] = source;

	// if source and target have the same parent
	if (source.parent === target.parent) {

		// deep copy parent array
		let arr;
		if (source.parent === null) {
			new_state.mainTimeline = new_state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			let parent = deepCopy(new_state[source.parent]);
			new_state[parent.id] = parent;
			arr = parent.childrenById;
		}
		// move source to pos of target
		let from = arr.indexOf(source.id);
		let to = arr.indexOf(target.id);
		arr.move(from, to);

	// if not 
	} else { 
		// delete source from old parent
		let sourceParent = source.parent;
		if (sourceParent === null) {
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== source.id));
		} else {
			sourceParent = deepCopy(new_state[sourceParent]);
			new_state[sourceParent.id] = sourceParent;
			sourceParent.childrenById = sourceParent.childrenById.filter((id) => (id !== source.id));
		}

		// deep copy parent array
		let targetParent = target.parent;
		let arr;
		if (targetParent === null) {
			new_state.mainTimeline = new_state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			targetParent = deepCopy(new_state[targetParent]);
			new_state[targetParent.id] = targetParent;
			arr = targetParent.childrenById;
		}

		// move source into wanted pos in parent
		let targetIndex = arr.indexOf(target.id);
		source.parent = target.parent;
		if (arr.indexOf(source.id) === -1) {
			// if we are moving out, we put source behind target
			if (action.isLast) {
				targetIndex++;
			}
			arr.splice(targetIndex, 0, source.id);
		}
	}

	return new_state;
}

/*
If node right above source node can take children,
move source into that node.
New parent automatically expands.
action = {
	id: id, // source
}
*/
export function moveInto(state, action) {
	let node = state[action.id];
	let parent = node.parent;
	let parentChildren;

	if (parent === null) {
		parentChildren = state.mainTimeline;
	} else {
		parentChildren = state[node.parent].childrenById;
	}

	let index = parentChildren.indexOf(node.id)
	// we have a candidate if
	// 1. source is not the first child of its parent
	// 2. the node above source is a timeline
	let hasParentCandidate =  index > 0 &&
		utils.isTimeline(state[parentChildren[index-1]]);

	
	if (hasParentCandidate) {
		// deep copies
		let new_state = Object.assign({}, state);
		node = deepCopy(node);
		new_state[node.id] = node;

		// delete source from old parent
		let parentCandidateId;
		if (parent === null) {
			parentCandidateId = new_state.mainTimeline[new_state.mainTimeline.indexOf(node.id)-1];
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== node.id));
		} else {
			parent = deepCopy(new_state[parent]);
			new_state[parent.id] = parent;
			parentCandidateId = parent.childrenById[parent.childrenById.indexOf(node.id)-1];
			parent.childrenById = parent.childrenById.filter((id) => (id !== node.id));
		}

		// deep copy new parent
		let parentCandidate = deepCopy(new_state[parentCandidateId]);
		new_state[parentCandidateId] = parentCandidate;

		// insert source into new parent, new parent automatically expands
		parentCandidate.collapsed = false;
		if (parentCandidate.childrenById.indexOf(node.id) === -1)
			parentCandidate.childrenById.push(node.id);
		node.parent = parentCandidateId;

		return new_state;
	} else {
		return state;
	}
 

}

/*
Move node by keyboard input.
action = {
	id: id, // source
	key: number, // denote arrow keys
}
*/
export function moveByKeyboard(state, action) {
	const { id, key } = action;

	let current = state[id];
	let parent = current.parent;
	if (parent === null) {
		parent = state.mainTimeline;
	} else {
		parent = state[parent].childrenById;
	}

	let currentIndex = parent.indexOf(current.id);
	let targetId;
	let isLast = false;
	switch (key) {
		// up
		case 38:
			// if already first
			if (currentIndex === 0) {
				return state;
			} else {
				targetId = parent[currentIndex - 1];
			}
			break;
		// down
		case 40:
			// if already last
			if (currentIndex === parent.length - 1) {
				return state; 
			} else {
				targetId = parent[currentIndex + 1];
			}
			break;
		// left
		case 37:
			// can't move left if
			// 1. has no parent, Or
			// 2. it is not the last child of its parent
			if (current.parent === null ||
				current.id !== parent[parent.length - 1]) {
				return state;
			} else {
				targetId = current.parent;
				isLast = true;
			}
			break;
		// right
		case 39:
			return moveInto(state, { id: id });
		default:
			return state;
	}

	return moveTo(state, { sourceId: id, targetId: targetId, isLast: isLast });
}


export function onPreview(state, action) {
	let new_state = Object.assign({}, state, {
		previewId: action.id
	});

	console.log(new_state);
	return new_state;
}

/*
action = {
	id: id, // target

	 // if is bool, meaning we set enabled to a specific value
	spec: bool or null,
}
*/
function onToggleHelper(state, id, spec=null) {
	let node = deepCopy(state[id]);
	state[node.id] = node;
	if (spec === null) {
		node.enabled = !node.enabled;
	} else {
		node.enabled = spec;
	}

	// recusive call to set all descendants of timeline
	// to have the same enabled attrib
	if (utils.isTimeline(node)) {
		for (let cid of node.childrenById) {
			onToggleHelper(state, cid, node.enabled)
		}
	}
}

export function onToggle(state, action) {
	let new_state = Object.assign({}, state);

	onToggleHelper(new_state, action.id, null);

	return new_state;
}

/*
action = {
	flag: bool, // whether enable or not
	spec: id, // toggle one only option
}
*/
export function setToggleCollectively(state, action) {
	const { flag, spec } = action;
	let new_state = Object.assign({}, state);

	for (let id of new_state.mainTimeline) {
		if (id === spec) {
			continue;
		}
		onToggleHelper(new_state, id, flag);
	}

	if (spec) {
		onToggleHelper(new_state, spec, true);
	}

	return new_state;
}


export function setCollapsed(state, action) {
	let timeline = state[action.id];

	let new_state = Object.assign({}, state);

	timeline = deepCopy(timeline);
 	timeline.collapsed = !timeline.collapsed;

	new_state[timeline.id] = timeline;

	return new_state;
}
<<<<<<< HEAD
=======

export function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);


	let params = window.jsPsych.plugins[action.newPluginVal].info.parameters;
	let paramKeys = Object.keys(params);

	var paramsObject = {};

	for(let i=0; i<paramKeys.length; i++) {
		paramsObject[paramKeys[i]] = params[paramKeys[i]].default;

	}

	node = deepCopy(node);

	node.pluginType = action.newPluginVal; 
	node.parameters = paramsObject;
	new_state[state.previewId] = node; 
	
	return new_state;
}

export function changeToggleValue(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

export function changeParamText(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	console.log(node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

export function changeParamInt(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}

export function changeParamFloat(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}

export function changeHeader(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node; 

	// node.timeline_variable = Object.assign({}, node.timeline_variable);
	// console.log("node.timeline_variable " + node.timeline_variable);
	//var array = [];

	// for(let i=0; i<node.timeline_variable.length; i++) {
	// 	// let rowCopy = Object.assign({}, node.timeline_variable[i]);
	// 	// array.push({rowCopy});
	// 	var clonedArray = JSON.parse(JSON.stringify(nodesArray))
	// }

	const newArray = node.timeline_variable.map(obj => Object.assign({}, obj));

	for(let i=0; i<node.timeline_variable.length; i++) {
		// node.timeline_variable[i][action.newVal] = node.timeline_variable[i][action.headerId];
		// delete node.timeline_variable[i][action.headerId];
		newArray[i][action.newVal] = newArray[i][action.headerId];
		delete newArray[i][action.headerId];
	}

	node.timeline_variable = newArray;
	return new_state;
}

export function changeCell(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	//node.timeline_variable = Object.assign({}, node.timeline_variable);
	const newArray = node.timeline_variable.map(obj => Object.assign({}, obj));

	let cellString = action.cellId; //string with row and column index
	var cellIndex = cellString.split(' '); 
	var columns = Object.keys(node.timeline_variable[0]); //array of headers
	console.log(columns[2]);

	var cellRow = cellIndex[0];
	var cellColumn = cellIndex[1];
	console.log("cellRow " + cellRow);
	console.log("cellColumn " + cellColumn);

	//var currentRow = node.timeline_variable[cellRow];
	var currentRow = newArray[cellRow];

	currentRow[columns[cellColumn]] = action.newVal;
    console.log("currentRow[columns[cellColumn]] " + currentRow[columns[cellColumn]]);
    
    node.timeline_variable = newArray;
    return new_state; 
}

export function addColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	new_state[state.previewId] = node;

	for(let i=0; i<node.timeline_variable.length; i++) {
		node.timeline_variable[i].newHeader = null; 
	}

	return new_state;
}

// function changeHeader(state, action) {
// 	let table = state[state.previewId];
// 	let new_state = Object.assign({}, state);

// 	let cellId = action.cellId;

// 	table = copyTable(table);
// 	new_state[] = action.cellId
// }




>>>>>>> b6ef4d5718743ad0e68746645b8fd130818f3045
