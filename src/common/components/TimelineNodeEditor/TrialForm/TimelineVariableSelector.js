import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';

import AddTimelineVarIcon from 'material-ui-icons/SwapHoriz';
// import DialogIcon from 'material-ui-icons/ShoppingBasket';
import UncheckStar from 'material-ui-icons/StarBorder';
import CheckStar from 'material-ui-icons/Star';
import CheckNoIcon from 'material-ui-icons/CheckBoxOutlineBlank';
import CheckYesIcon from 'material-ui-icons/CheckBox';
import {
	cyan500 as checkColor,
	// blue500 as titleIconColor,
	yellow500 as checkStarColor,
	cyan500 as hoverColor
} from 'material-ui/styles/colors';


import { renderDialogTitle } from '../../gadgets';

export default class TimelineVariableSelector extends React.Component {
	static propTypes = {
		submitCallback: PropTypes.func,
		openCallback: PropTypes.func,
		closeCallback: PropTypes.func,
		setParamMode: PropTypes.func,
		title: PropTypes.string,
		useTV: PropTypes.bool,
		selectedTV: PropTypes.string,
	};

	static defaultProps = {
		title: "Timeline Variables",
		openCallback: function() {
			return;
		},
		closeCallback: function() {
			return;
		},
		submitCallback: function(newCode) {
			return;
		},
		setParamMode: function() {
			return;
		}
	}

	state = {
		open: false,
	}

	handleOpen = () => {
		this.setState({
			open: true
		});
		this.props.openCallback();
	}

	handleClose = () => {
		this.setState({
			open: false
		});
		this.props.closeCallback();
	}

	render() {
		return (
			<div>
				<IconButton onTouchTap={this.handleOpen} tooltip="Insert timeline variable">
					<AddTimelineVarIcon hoverColor={hoverColor}/>
				</IconButton>
				<Dialog
					open={this.state.open}
					contentStyle={{minHeight: 500}}
					modal={true}
					titleStyle={{padding: 0}}
					title={
						renderDialogTitle(
							<Subheader style={{fontSize: 20, maxHeight: 48}}>
							{this.props.title}
							</Subheader>, 
							this.handleClose, 
							null)
					}
					actions={[<FlatButton
								label="Close"
								primary={true}
								labelStyle={{textTransform: "none", }}
				    			keyboardFocused={true}
								onTouchTap={this.handleClose}
							/>]}
				>	
					<div style={{display: 'flex'}}>
			              <p style={{paddingTop: 15, color: (this.props.useFunc) ? 'blue' : 'black'}}>
			                Use Timeline Variable:
			              </p>
			              <IconButton
			                onTouchTap={this.props.setParamMode}
			                >
			                {(this.props.useTV) ? <CheckStar color={checkStarColor} /> : <UncheckStar />}
			                </IconButton>
			         </div>
					<Paper style={{minHeight: 400, maxHeight: 400}}>
						<List style={{minHeight: 400, maxHeight: 400, overflowY: 'auto', width: '98%', margin: 'auto'}}>
							{this.props.timelineVariables.map((v) => (
								<ListItem 
									primaryText={!v ? "null" : v} 
									key={"TimelineVariableSelector-"+v}
									onTouchTap={() => {
										this.props.submitCallback(v);
									}}
									rightIcon={
										v === this.props.selectedTV ? <CheckYesIcon color={checkColor}/> : <CheckNoIcon color={checkColor}/>
									}
								/>
							))}
						</List>
					</Paper>
				</Dialog>
			</div>
		)
	}
}

// <div style={{display: 'flex'}}>
// 								<div style={{paddingTop: 4, paddingRight: 10}}>
// 									<DialogIcon color={titleIconColor}/>
// 								</div>
// 								<div style={{fontSize: 20,}}>
// 			      					{this.props.title}
// 			      				</div>
// 		      				</div>