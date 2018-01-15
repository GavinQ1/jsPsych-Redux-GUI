import React from 'react';

import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
 
import TrialIcon from 'material-ui-icons/ModeEdit';

import {
	indigo500 as iconHighlightColor,
	green500 as checkColor,
	grey300 as hoverColor,
	grey600 as normalColor,
	grey400 as disabledColor
} from 'material-ui/styles/colors';

import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';
import {
	colorSelector,
	treeNodeDnD,
	setKeyboardFocusId,
	getKeyboardFocusId
} from './TimelineItem';

import NestedContextMenus from './NestedContextMenus';


class TrialItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contextMenuOpen: false,
			toggleContextMenuOpen: false,
		}

		this.openContextMenu = (event) => {
			event.preventDefault();
			event.stopPropagation();
			this.setState({
				contextMenuOpen: true,
				anchorEl: event.currentTarget, 
			})
		}

		this.closeContextMenu = () => {
			this.setState({
				contextMenuOpen: false
			})
		}

		this.openToggleContextMenu = (event) => {
			event.preventDefault();
			event.stopPropagation();
			this.setState({
				toggleContextMenuOpen: true,
				anchorEl: event.currentTarget, 
			})
		}

		this.closeToggleContextMenu = () => {
			this.setState({
				toggleContextMenuOpen: false
			})
		}
	}

	componentDidMount() {
		if (getKeyboardFocusId() === this.props.id) {
			this.refs[this.props.id].applyFocusState('keyboard-focused');
		}
	}

	render() {
		const {
			connectDropTarget,
			connectDragPreview,
			connectDragSource,
			isOverCurrent,
			isEnabled,
			isSelected,
			onClick,
			id,
			name,
			listenKey
		} = this.props;
		
		let iconColor = isEnabled ? normalColor : disabledColor;

		return connectDragPreview(connectDropTarget(
			<div>
				<div className={treeNodeDnD.ITEM_TYPE} style={{
						display:'flex', 
						backgroundColor: colorSelector(isOverCurrent, isSelected),
					}} >
					{
					connectDragSource(<div className="Drag-Handle">
						<IconButton 
							hoveredStyle={{backgroundColor: hoverColor}}
							disableTouchRipple={true} 
							onTouchTap={onClick}>
							<TrialIcon color={(isSelected) ? iconHighlightColor : iconColor}/>
						</IconButton>
					</div>)
					}
					<div style={{width: "100%"}} >
						<ListItem  
							ref={id}
							style={{color: isEnabled ? 'black' : 'grey'}}
							primaryText={name}
							onKeyDown={(e) => { listenKey(e, getKeyboardFocusId) }}
							onContextMenu={this.openContextMenu}
							onTouchTap={(e) => {
								if (e.nativeEvent.which === 1) {
									this.props.onClick(setKeyboardFocusId);
								}
							}}
						/>
					</div>
						<NestedContextMenus
								openItemMenu={this.state.contextMenuOpen}
								anchorEl={this.state.anchorEl}
								onRequestCloseItemMenu={this.closeContextMenu}
								insertTimeline={this.props.insertTimeline}
								insertTrial={this.props.insertTrial}
								deleteNode={this.props.deleteTrial}
								duplicateNode={this.props.duplicateTrial} 

								openToggleMenu={this.state.toggleContextMenuOpen}
								onRequestCloseToggleMenu={this.closeToggleContextMenu}
								onToggle={this.props.onToggle}
								isEnabled={this.props.isEnabled}
							/>
					</div>
				</div>
		))
	}
}

export default flow(
	DragSource(
		treeNodeDnD.ITEM_TYPE,
		treeNodeDnD.itemSource,
		treeNodeDnD.sourceCollector),
	DropTarget(
		treeNodeDnD.ITEM_TYPE,
		treeNodeDnD.itemTarget,
		treeNodeDnD.targetCollector))(TrialItem)