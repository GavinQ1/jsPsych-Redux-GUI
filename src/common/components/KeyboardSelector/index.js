/*
keyChoices uses the names of keys in the { keylookup } object defined in jspsych.js, which are subject to future changes.

*/

import React from 'react';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';

import BoxCheckIcon from 'material-ui/svg-icons/toggle/check-box';
import BoxUncheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import KeyboardIcon from 'material-ui/svg-icons/hardware/keyboard';

import { renderDialogTitle } from '../gadgets';

import GeneralTheme from '../theme.js';

const jsPsych = window.jsPsych;

const colors = {
	...GeneralTheme.colors
}

const style = {
	Dialog: {
		bodyStyle: {
			backgroundColor: '#FAFAFA',
			paddingTop: '0px',
		},
		titleStyle: {
			padding: 0,
			borderBottom: '1px solid #aaa'
		},
		titleSubheader: {
			color: colors.primaryDeep
		},
		paperProps: {
			style: {
				width: 900,
				margin: '0 auto',
			}
		},
	},
	AllKeysToggle: {
		root: {
			marginBottom: '5px',
			marginTop: '5px',
		},
		container: {
			marginTop: '5px',
			maxWidth: '250px'
		},
		Toggle: {
			labelStyle: {
				color: colors.primaryDeep
			},
			thumbSwitchedStyle: {
				backgroundColor: colors.primary
			},
			trackSwitchedStyle: {
				backgroundColor: colors.primary
			}
		}
	},
	Keyboard: {
		Paper: {
			style: {
				backgroundColor: '#EEEEEE',
			}
		}
	},
	Key: (isSelected, allKeys) => ({
		backgroundColor: isSelected ? colors.primary : 'white',
		style: {
			minWidth: '36px',
			height: '36px',
			margin: '8px'
		},
		labelStyle: {
			fontWeight: isSelected ? 'bold' : 'normal',
			color: isSelected || allKeys ? 'white' : 'black'
		}
	}),
	Actions: {
		Apply: {
			label: {
				textTransform: "none", 
				color: colors.primaryDeep
			}
		}
	},
	DefaultTrigger: {
		hoverColor: colors.secondary
	}
}


const keyChoices = [
	[...'`1234567890-='.split(''), 'backspace'],
	['tab', ...'qwertyuiop[]\\'.split('')],
	[..."asdfghjkl;'".split(''), 'enter'],
	[...'zxcvbnm,./'.split('')],
	['esc', 'space', 'insert', 'delete', 'pgup', 'pgdn', 'end'],
	['uparrow', 'downarrow', 'leftarrow', 'rightarrow']
]

const toPrettyName = (key) => {
	if (!key) return '';
	let newKey = '';
	switch(key) {
		case 'uparrow':
		case 'downarrow':
		case 'leftarrow':
		case 'rightarrow':
			newKey = 'Arrow-' + key.replace('arrow', '');
			break;
		default:
			newKey = key;
	}
	return newKey.toUpperCase();
}

class Key extends React.Component {
	constructor(props) {
		super(props);

		this.deselectKey = () => {
			this.props.deselectKey(this.props.label);
		}

		this.selectKey = () => {
			this.props.selectKey(this.props.label);
		}
	}

	static defaultProps = {
		label: ''
	}

	render() {
		let isSelected = false;
		if (Array.isArray(this.props.selected)) {
			for (let v of this.props.selected) {
				if (v === this.props.label) {
					isSelected = true;
				}
			}
		} else {
			if (this.props.selected && this.props.label) {
				isSelected = this.props.selected.toUpperCase() === this.props.label.toUpperCase();
			}
		}

		return (
			<RaisedButton
				{...style.Key(isSelected, this.props.allKeys)}
				label={toPrettyName(this.props.label)}
				onClick={isSelected ? this.deselectKey : this.selectKey}
				disabled={this.props.allKeys}
			/>
		)
	}
}

class KeyRow extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		choices: []
	}

	render() {
		return (
			<div style={{display: 'flex'}}>
				{this.props.choices.map((l,i) => (
					<Key 
						key={`${l}-${i}-key`} 
						label={l}
						selected={this.props.selected}
						selectKey={this.props.selectKey}
						deselectKey={this.props.deselectKey}
						allKeys={this.props.allKeys}
					/>
				))
				}
			</div>	
		) 
	}
}

class Keyboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.props.value === jsPsych.ALL_KEYS ? '' : (this.props.value ? this.props.value : ''),
			allKeys: this.props.value === jsPsych.ALL_KEYS
		}

		this.selectKey = (key) => {
			if (this.props.multiSelect) {
				let temp = (Array.isArray(this.state.selected) && this.state.selected.slice()) || [];
				temp.push(key);
				this.setState({
					selected: temp
				});
			} else {
				this.setState({
					selected: key
				})
			}
		}

		this.deselectKey = (key) => {
			if (this.props.multiSelect) {
				let temp = [];
				for (let v of this.state.selected) {
					if (v !== key) {
						temp.push(v);
					}
				}
				this.setState({
					selected: temp
				});
			} else {
				this.setState({
					selected: (this.state.selected.toUpperCase() === key.toUpperCase()) ? '' : this.state.selected.toUpperCase()
				})
			}
		}

		this.toggleAllKey = () => {
			this.setState({
				allKeys: !this.state.allKeys
			})
		}

		this.onCommit = () => {
			this.props.onCommit(this.state.selected, this.state.allKeys);
		}
	}

	render() {
		return (
			<div>
				<div style={{...style.AllKeysToggle.root}}>
					<div style={{...style.AllKeysToggle.container}}>
						<Toggle
					      label="All Keys"
					      toggled={this.state.allKeys}
					      onToggle={this.toggleAllKey}
					      {...style.AllKeysToggle.Toggle}
					    />
				    </div>
			    </div>
			    <Paper {...style.Keyboard.Paper}>
					{keyChoices.map((choices, i) => (
						<KeyRow 
							choices={choices} 
							key={`keyRow-${i}`} 
							selected={this.state.selected}
							selectKey={this.selectKey}
							deselectKey={this.deselectKey}
							allKeys={this.state.allKeys}
						/>
					))
					}
				</Paper>
			</div>
		)
	}
}

export default class KeyboardSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		}

		this.handleOpen = () => {
			this.setState({
				open: true
			})
		}

		this.handleClose = () => {
			this.setState({
				open: false
			})
		}

		this.onCommit = () => {
			if (this.Keyboard.state.allKeys) {
				this.props.onCommit(jsPsych.ALL_KEYS);
			} else {
				this.props.onCommit(this.Keyboard.state.selected);
			}
			this.handleClose();
		}
	}

	static defaultProps = {
		// can select multiple keys
		multiSelect: false,
		// value, can be string (single select) or array (mulitple select)
		value: '',
		// Trigger to activate editor
		Trigger: ({onClick}) => (
			<IconButton
				onClick={onClick}
				title="Click To Select"
			>
				<KeyboardIcon {...style.DefaultTrigger} />
			</IconButton>
		),
		// commit callback
		onCommit: () => {},
	}

	render() {
		let { value } = this.props;
		let label, tip;
		if (Array.isArray(value)) {
			label = value.length > 0 ? `[${value.length > 1 ? 'Keys' : 'Key'}: ${toPrettyName(value[0])}${value.length > 1 ? ' ...' : ''}]` : 'Key Choices'
			tip = value.length > 0 ? value.map(v => toPrettyName(v)) : '';
		} else {
			if (this.props.value === jsPsych.ALL_KEYS) {
				tip = label = '[ALL KEYS]';
			} else {
				label = this.props.value ? `[Key: ${toPrettyName(this.props.value)}]` : '[NO KEY]';
				tip = value ? toPrettyName(value) : '';
			}
		}

		const actions = [
			<FlatButton
				label="Apply"
				labelStyle={{...style.Actions.Apply.label}}
				onClick={this.onCommit}
				keyboardFocused
			/>
		]
		return (
			<div>
				<div title={tip}> 
					<this.props.Trigger onClick={this.handleOpen} label={label}/>
				</div>
				<Dialog
					modal={true}
					open={this.state.open}
					actions={actions}
	              	title={renderDialogTitle(
	              		<Subheader style={{...style.Dialog.titleSubheader}}>
	              			{`Parameter Name: ${this.props.parameterName}`}
	              		</Subheader>, 
	              		this.handleClose, 
	              		null
	              		)
	              	}
					{...style.Dialog}
				>	
					<Keyboard {...this.props} ref={el => { this.Keyboard = el }}/>
				</Dialog>
			</div>
		)
	}
}