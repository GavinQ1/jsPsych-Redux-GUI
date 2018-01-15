import React from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import NewTimelineIcon from 'material-ui-icons/PlaylistAdd';
import NewTrialIcon from 'material-ui-icons/NoteAdd';
import Delete from 'material-ui-icons/Delete';
import Duplicate from 'material-ui-icons/ContentCopy';

import SelectAllIcon from 'material-ui-icons/SelectAll';
import DeselectAllIcon from 'material-ui-icons/Block';
import SelectThisOnlyIcon from 'material-ui-icons/GpsFixed';
import CheckIcon from 'material-ui-icons/RadioButtonChecked';
import UnCheckIcon from 'material-ui-icons/RadioButtonUnchecked';

import {
	pink500 as contextMenuIconColor,
	grey100 as contextMenuBackgroundColor,
} from 'material-ui/styles/colors';

const contextMenuStyle = {
	outerDiv: { position: 'absolute', zIndex: 20},
	innerDiv: { backgroundColor: contextMenuBackgroundColor,
				borderBottom: '1px solid #BDBDBD' },
	lastInnerDiv: { backgroundColor: contextMenuBackgroundColor },
	iconColor: contextMenuIconColor,
}

export default class NestedContextMenus extends React.Component {

	render() {
		return (
				<div>
					<Popover
			          open={this.props.openItemMenu}
			          anchorEl={this.props.anchorEl}
			          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
			          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
			          onRequestClose={this.props.onRequestCloseItemMenu}
			        >
			        <Menu>
						<MenuItem primaryText="New Timeline" 
							leftIcon={<NewTimelineIcon color={contextMenuStyle.iconColor} />}
							onTouchTap={()=>{ this.props.insertTimeline(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="New Trial"  
							leftIcon={<NewTrialIcon color={contextMenuStyle.iconColor}/>}
							onTouchTap={()=>{ this.props.insertTrial(); this.props.onRequestCloseItemMenu()}}
						/><Divider />
						<MenuItem primaryText="Delete"  
							leftIcon={<Delete color={contextMenuStyle.iconColor}/>}
							onTouchTap={()=>{ this.props.deleteNode(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="Duplicate"  
							leftIcon={<Duplicate color={contextMenuStyle.iconColor}/>}
							onTouchTap={()=>{ this.props.duplicateNode(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText={this.props.isEnabled ? "Disable" : "Enable"}
							leftIcon={
								this.props.isEnabled ?
								<CheckIcon color={contextMenuStyle.iconColor} />:
								<UnCheckIcon color={contextMenuStyle.iconColor} />
							}
							onTouchTap={()=>{ this.props.onToggle(); this.props.onRequestCloseItemMenu()}}
						/>
					</Menu>
					</Popover>
				</div>
		)
	}
}

