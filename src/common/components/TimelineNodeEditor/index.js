import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Draggable from 'react-draggable';

import CloseDrawerHandle from 'material-ui-icons/ChevronRight';
import OpenDrawer from 'material-ui-icons/ChevronLeft';
import {
	grey300 as popDrawerColor,
	grey400 as DrawerHandleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

import TrialForm from '../../containers/TimelineNodeEditor/TrialForm';
import TimelineForm from '../../containers/TimelineNodeEditor/TimelineForm';
import { convertPercent } from '../App';

import './TimelineNodeEditor.css';

export const MIN_WIDTH = 25;
const MAX_WIDTH = 50;

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));

const enableAnimation = (flag) => ((flag) ? 'none' : 'all 0.4s ease');

const getWidthFromDragging = (e) => {
	let percent = (1 - (e.pageX / window.innerWidth)) * 100;
	if (percent < MIN_WIDTH) percent = MIN_WIDTH;
	if (percent > MAX_WIDTH) percent = MAX_WIDTH;
	return percent;
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

export default class TimelineNodeEditorDrawer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dragging: false,
		}

		this.onDragStart = (e) => {
			this.setState({
				dragging: true,
			});
		}

		this.onDragEnd = (e) => {
			this.setState({
				dragging: false,
			});
		}

		this.onDrag = (e) => {
			this.props.setWidthCallback(getWidthFromDragging(e));
			pauseEvent(e)
		}

	}

	render() {
		return (
			<div className="TimelineNode-Editor"
					style={{width: (this.props.open) ? convertPercent(this.props.width) : '0%',
						'WebkitTransition': enableAnimation(this.state.dragging),
						'MozTransition': enableAnimation(this.state.dragging),
						transition: enableAnimation(this.state.dragging),
						}}>
				{this.props.open ?
					<Draggable
					        axis="x"
					        handle=".TimelineNode-Editor-Dragger"
					        zIndex={10}
					        position={{x: this.props.width}}
					        onStart={this.onDragStart}
					        onDrag={this.onDrag}
					        onStop={this.onDragEnd}
					        >
		  				<div className="TimelineNode-Editor-Dragger" style={{width: '8px', minWidth: '8px'}}>
			  				<div className="TimelineNode-Editor-Close-Handle-Container">
			  						<IconButton
			  							className="TimelineNode-Editor-Close-Handle"
			  							tooltip="Close"
			  							tooltipPosition="bottom-left"
			  							hoveredStyle={{
						  					left: 0,
				  							width: 26.5,
			  								backgroundColor: CloseBackHighlightColor
			  							}}
			  							style={{
				  							width: 25,
				  							left: -5,
			  							}}
			  							iconStyle={{
			  								margin: '0px 0px 0px -12px'
			  							}}
			  							disableTouchRipple={true}
										onTouchTap={this.props.closeTimelineEditorCallback}
			  							>
			  							<CloseDrawerHandle />
			  						</IconButton>
			  					</div>
			  			</div>
		  			</Draggable> :
		  			null
				}
				

				<div className="TimelineNode-Editor-Container">
					{(this.props.open) ?
					<div className="TimelineNode-Editor-Content">
						<div className="TimelineNode-Editor-Header" 
							 style={{
							 	flexBasis: 'auto',
							 	height: (this.props.isTimeline) ? '60px' : '120px',
							 	minHeight: (this.props.isTimeline) ? '60px' : '120px',
							 }}
							 >
							<Subheader >
							{(this.props.previewId) ?
								<div>
									<TextField
											floatingLabelText={this.props.label}
											id="Node-Name-Textfield"
			                				value={this.props.nodeName}
			                				fullWidth={true}
											onChange={this.props.changeNodeName} />
									{(!this.props.isTimeline) ?
									<div style={{display: 'flex', width: "100%"}}>
										<p style={{display: 'inline-block', paddingRight: 15}}>
												{"Plugin:"}
											</p>
										<div style={{display: 'inline-block', width: "100%"}}>
											<SelectField
												fullWidth={true}
												value={this.props.pluginType}
												title={this.props.pluginType}
												maxHeight={300}
												onChange={(event, key) => this.props.changePlugin(PluginList[key])} 
											>
											{PluginList.map((plugin) => (<MenuItem primaryText={plugin} key={plugin+"-Item-Name"} value={plugin} />))}
											</SelectField>
										</div>
									</div>:
									null
									}
								</div>
								: null
							}
							</Subheader>
						</div>
						<Divider />
						{(this.props.previewId) ?
							<div className="TimelineNode-Editor-Sheet">
								<List style={{padding: 5, paddingTop: 0, width: '95%'}}>
									{this.props.isTimeline ?
										<TimelineForm id={this.props.previewId} /> :
										<TrialForm id={this.props.previewId} pluginType={this.props.pluginType} />
									}

								</List> 
							</div> :
						null}
					</div> : 
					null}
				</div>
  				{(this.props.open) ? null :
  					<IconButton
  						className="TimelineNode-Editor-Handle"
  						tooltip="Open Timeline/Trial Editor"
  						hoveredStyle={{
  							backgroundColor: DrawerHandleColor,
  							right: 0,
  						}}
  						onTouchTap={this.props.openTimelineEditorCallback}
  						tooltipPosition="bottom-left"
  						style={{
	  					position: 'fixed',
	  					right: -8,
	  					top: '50%',
	  					width: 25,
	  					backgroundColor: popDrawerColor,
	  					padding: '12px 0',
	  					zIndex: 1,
  				}}><OpenDrawer /></IconButton>}
  			</div>
  			)
	}
}
