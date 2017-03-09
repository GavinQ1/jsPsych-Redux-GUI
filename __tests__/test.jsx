import React from 'react';
import {Trial, InitialState, guiState} from '../src/reducers.jsx'; 
import deepFreeze from 'deep-freeze';
deepFreeze(InitialState);

var Trial1 = {
    id: 1,
    name: "Trial_1",
    isTimeline: false,
    timeline: [],
    trialType: "trialType",
    parentTrial: -1,
    selected: true
}

const testState0 = {
    trialTable: {
        [Trial.name]: Trial,
        [Trial1.name]: Trial1
    },
    trialOrder: [ 'default', Trial1.name],
    openDrawer: 'none',
    previousStates: [],
    futureStates: []
}

// ----- DEFINE THE OBJECTS GENERATED BY REDUCERS ----- //

// Test adding trials
const addTrial1 = guiState(InitialState, {type: 'ADD_TRIAL'});

// const addTrial2 = timeline(desired1, {type: 'ADD_TRIAL'});

// Test removing trials
// const removeTrial1 = timeline(desired2, {type: 'REMOVE_TRIAL', index: desired2.selected });

//const removeTrial2 = timeline(initialState, {type: 'REMOVE_TRIAL', index: initialState.selected });

//const removeTrial3 = timeline(desired3selected1, {type: 'REMOVE_TRIAL', index: desired3selected1.selected });

// Test setting the initial state
//const initialState1 = timeline(initialState, {type: 'INITIAL_STATE'});

//const initialState2 = timeline(desired2, {type: 'INITIAL_STATE'});

// Test selecting a trial
//const selectTrial1 = timeline(desired3, {type: 'SELECT_TRIAL', index: 1});

//const selectTrial2 = timeline(initialState, {type: 'SELECT_TRIAL', index: 4});

// Test the timeline reducer 
describe('timeline Reducer', () => {

    it('ADD_TRIAL', () => {
	// Add trial to empty timeline
	expect(addTrial1).toEqual(testState0);
	// Add trial to populated timeline
//	expect(addTrial2).toEqual(desired2);
    });
/*
    it('REMOVE_TRIAL', () => {
	// Remove trial from populated timeline
	expect(removeTrial1).toEqual(desired1);
	// Remove trial from empty timeline
	expect(removeTrial2).toEqual(emptyState);
	// Remove internal trial
	expect(removeTrial3).toEqual(desired3removed1);
    });

    it('INITIAL_STATE', () => {
	// Set state from empty timeline
	expect(initialState1).toEqual(desired1);
	// Set state from populated timeline
	expect(initialState2).toEqual(desired1); 
    });

    it('SELECT_TRIAL', () => {
	// Select trial within range
	expect(selectTrial1).toEqual(desired3selected1);
	// Select trial output of trial range
	expect(selectTrial2).toEqual(emptyState);
    });
      it('OPEN_DRAWER', () => {

      });*/
});




//----- DEFINE STATE OBJECTS FOR TESTING -----//
/*
// Define the initial state
const initialState = {
    selected: [],
    trials: [],
    openDrawers: []
};

const emptyState = {
	selected: [-1],
	trials: [],
	openDrawers: []
};

// Ensure that the store is not mutated
deepFreeze(initialState);

// Define the desired state after calling 'ADD_TRIAL'
const desired1 = {
    selected: [0],
    trials: [
	{
	    id: 0,
	    name: "Trial_0",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	}
    ],
	openDrawers: ['pluginDrawer']
};
deepFreeze(desired1);

const desired2 = {
    selected: [1],
    trials: [
	{
	    id: 0,
	    name: "Trial_0",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	},
	{
	    id: 1,
	    name: "Trial_1",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	}
    ],
	openDrawers: ['pluginDrawer']
};
deepFreeze(desired2);

const desired3 = {
    selected: [2],
    trials: [
	{
	    id: 0,
	    name: "Trial_0",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	},
	{
	    id: 1,
	    name: "Trial_1",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	},
	{
	    id: 2,
	    name: "Trial_2",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	}
    ],
	openDrawers: ['pluginDrawer']
};
deepFreeze(desired3);

const desired3selected1 = {
    selected: [1],
    trials: [
	{
	    id: 0,
	    name: "Trial_0",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	},
	{
	    id: 1,
	    name: "Trial_1",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	},
	{
	    id: 2,
	    name: "Trial_2",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	}
    ],
	openDrawers: ['pluginDrawer']
};
deepFreeze(desired3selected1);

const desired3removed1 = {
    selected: [0],
    trials: [
	{
	    id: 0,
	    name: "Trial_0",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	},
	{
	    id: 2,
	    name: "Trial_2",
	    children: [],
	    type: "type",
	    pluginType: "pluginType",
	    pluginData: [],
	    errors: null
	}
    ],
	openDrawers: ['pluginDrawer']
};
deepFreeze(desired3removed1);

// ----- DEFINE THE OBJECTS GENERATED BY REDUCERS ----- //

// Test adding trials
const addTrial1 = timeline(initialState, {type: 'ADD_TRIAL'});

const addTrial2 = timeline(desired1, {type: 'ADD_TRIAL'});

// Test removing trials
const removeTrial1 = timeline(desired2, {type: 'REMOVE_TRIAL', index: desired2.selected });

const removeTrial2 = timeline(initialState, {type: 'REMOVE_TRIAL', index: initialState.selected });

const removeTrial3 = timeline(desired3selected1, {type: 'REMOVE_TRIAL', index: desired3selected1.selected });

// Test setting the initial state
const initialState1 = timeline(initialState, {type: 'INITIAL_STATE'});

const initialState2 = timeline(desired2, {type: 'INITIAL_STATE'});

// Test selecting a trial
const selectTrial1 = timeline(desired3, {type: 'SELECT_TRIAL', index: 1});

const selectTrial2 = timeline(initialState, {type: 'SELECT_TRIAL', index: 4});

// Test the timeline reducer 
describe('timeline Reducer', () => {

    it('ADD_TRIAL', () => {
	// Add trial to empty timeline
	expect(addTrial1).toEqual(desired1);
	// Add trial to populated timeline
	expect(addTrial2).toEqual(desired2);
    });

    it('REMOVE_TRIAL', () => {
	// Remove trial from populated timeline
	expect(removeTrial1).toEqual(desired1);
	// Remove trial from empty timeline
	expect(removeTrial2).toEqual(emptyState);
	// Remove internal trial
	expect(removeTrial3).toEqual(desired3removed1);
    });

    it('INITIAL_STATE', () => {
	// Set state from empty timeline
	expect(initialState1).toEqual(desired1);
	// Set state from populated timeline
	expect(initialState2).toEqual(desired1); 
    });

    it('SELECT_TRIAL', () => {
	// Select trial within range
	expect(selectTrial1).toEqual(desired3selected1);
	// Select trial output of trial range
	expect(selectTrial2).toEqual(emptyState);
    });
      it('OPEN_DRAWER', () => {

      });
});*/
