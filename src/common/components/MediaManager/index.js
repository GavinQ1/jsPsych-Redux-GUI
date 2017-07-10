import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dropzone from 'react-dropzone';
import LinearProgress from 'material-ui/LinearProgress';
const mime = require('mime-types');
import {List, ListItem} from 'material-ui/List';

import {
	grey800 as normalColor,
	cyan600 as iconHighlightColor,
	cyan500 as checkColor,
	blue800 as titleIconColor,
	indigo500 as hoverColor,
	cyan500 as iconColor
} from 'material-ui/styles/colors';
import Add from 'material-ui/svg-icons/av/library-add';
import Media from 'material-ui/svg-icons/action/shopping-cart';
import MediaManagerIcon from 'material-ui/svg-icons/image/photo-library';
import ImageIcon from 'material-ui/svg-icons/image/photo';
import MovieIcon from 'material-ui/svg-icons/image/movie-creation';
import AudioIcon from 'material-ui/svg-icons/image/audiotrack';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import PDFIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import CheckNoIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckYesIcon from 'material-ui/svg-icons/toggle/check-box';

import { renderDialogTitle } from '../gadgets';
import Notification from '../../containers/Notification';

var __DEBUG__ = false;

export function fileIconFromTitle(title) {
	const type = mime.lookup(title);
	if(type === false){
		return <FileIcon />
	} else if(type.indexOf('image') > -1){
		return <ImageIcon />
	} else if(type.indexOf('pdf') > -1){
		return <PDFIcon />
	} else if(type.indexOf('video') > -1){
		return <MovieIcon />
	} else if(type.indexOf('audio') > -1){
		return <AudioIcon />
	}
	return <FileIcon />
}

export const MediaManagerMode = {
	upload: 'Upload',
	select: 'Select',
	multiSelect: 'multi-Select'
}

export default class MediaManager extends React.Component {
	static propTypes = {
		parameterName: PropTypes.string,
		mode: PropTypes.string
	};
	static defaultProps = {
		mode: MediaManagerMode.upload,
		parameterName: null,
	}

	constructor(props) {
		super(props);

		this.state = {
			open: false || __DEBUG__,
			files: [],
			s3files: {},
			filenames: [],
			dropzoneActive: false,
			selected: [],
			completed: {},
		};

		this.handleEnter = () => {
			this.setState({
				dropzoneActive: true
			});
		}

		this.handleExit = () => {
			this.setState({
				dropzoneActive: false
			});
		}

		this.progressHook = (filename, percent) => {
			let completed = this.state.completed;
			if (completed[filename] === undefined) {
				completed[filename] = 0;
			} else if (percent === 100) {
				delete completed[filename];
			} else {
				completed[filename] = percent;
			}
			this.setState({
				completed: completed
			})
		}

		this.startProgress = (filename) => {
			let completed = this.state.completed;
			completed[filename] = 0;
			this.setState({
				completed: completed
			})
		}

		this.handleOpen = () => {
			this.props.checkBeforeOpen(() => {
				// this.updateList();
				this.setState({
					open: true,
					dropzoneActive: false,
				});
			});
		};

		this.handleClose = () => {
			this.setState({
				open: false,
				dropzoneActive: false,
			});
		};

		this.onDrop = (files) => {
			this.setState({
				dropzoneActive: false
			});
			this.handleUpload(files);
		}

		this.handleSelect = (index) => {
			let selected = this.state.selected;
			selected[index] = !selected[index];
			this.setState({
				selected: selected,
			});
		}

		this.handleUpload = (files) => {
			this.props.uploadFiles(files, (update) => {
				this.setState(update);
			},
			this.progressHook);
		}

		this.handleDelete = () => {
			this.props.deleteFiles(
				this.state.s3files.Contents.filter((item, i) => (this.state.selected[i])).map((item) => (item.Key)),
				(update) => {
					this.setState(update);
				}
			);
		}

		this.updateList = () => {
			this.props.updateFileList((update) => {
				this.setState(update);
			});
		}

		this.insertFile = () => {
			this.props.insertFile(
				this.state.s3files.Contents.filter((item, i) => (this.state.selected[i])).map((item) => (item.Key)),
				this.state.s3files.Prefix,
				this.handleClose
			);
		}
	}

	componentDidMount = () => {
		this.updateList();
	}

	renderTrigger = () => {
		switch(this.props.mode) {
			case MediaManagerMode.select:
				return (
					<div style={{display:'flex'}}>
						<div style={{paddingTop: 20, paddingRight: 15}} >
							{this.props.parameterName+":"}
						</div>
						<AutoComplete
							id="Selected-File-Input"
							fullWidth={true}
							searchText={this.props.selected}
							title={this.props.selected}
							dataSource={this.state.filenames}
							filter={(searchText, key) => (searchText === "" || key.startsWith(searchText) && key !== searchText)}
							listStyle={{maxHeight: 200, overflowY: 'auto'}}
							onUpdateInput={(t) => { this.props.autoFileInput(t, this.state.s3files.Prefix, this.state.filenames); }}
						/>
						<IconButton 
							onTouchTap={this.handleOpen}
							tooltip="Insert Medias"
						>
							<Add hoverColor={hoverColor} color={iconColor}/>
						</IconButton>
					</div>
				)
			case MediaManagerMode.multiSelect:
				return (<IconButton 
							onTouchTap={this.handleOpen}
							tooltip="Insert Medias"
						>
							<Add hoverColor={hoverColor} color={iconColor}/>
						</IconButton>)
			case MediaManagerMode.upload:
			default:
				return (
					<IconButton
		              tooltip="Media Manager"
		              onTouchTap={this.handleOpen}
		          	>
		              <MediaManagerIcon
		                color={(this.state.open) ? iconHighlightColor :normalColor}
		                hoverColor={iconHighlightColor}
		              />
		          	</IconButton>
				);
		}
	}

	renderActions = () => {
		const deleteButton = (<FlatButton
				label="Delete"
				labelStyle={{textTransform: "none", color: 'red'}}
				onTouchTap={this.handleDelete}
			/>);
		switch(this.props.mode) {
			case MediaManagerMode.select:
			case MediaManagerMode.multiSelect:
				return [
				<FlatButton
					label="Insert"
					labelStyle={{textTransform: "none", color: 'blue'}}
					onTouchTap={this.insertFile}
				/>,
				deleteButton
				];
			case MediaManagerMode.upload:
			default:
				return [
					deleteButton,
					<FlatButton
			            label="Close"
			            primary={true}
			            keyboardFocused={true}
			            labelStyle={{textTransform: "none",}}
			            onTouchTap={this.handleClose}
			        />
				]
			}
	}

	render() {
		const overlayStyle = {
			position: 'absolute',
			top: 0,
			right: 0,
			left: 0,
			bottom: 0,
			background: 'rgba(0,0,0,0.5)',
			textAlign: 'center',
			color: '#fff'
		}

		let mediaList = null;
		if (this.state.s3files && this.state.s3files.Contents) {
			mediaList = this.state.s3files.Contents.map((f, i) =>
				<ListItem
					key={f.ETag}
					primaryText={f.Key.replace(this.state.s3files.Prefix, '')}
					leftIcon={fileIconFromTitle(f.Key)}
					rightIconButton={
						<IconButton
							onTouchTap={() => {this.handleSelect(i)}}
							>
							{this.state.selected[i] ? <CheckYesIcon color={checkColor}/> : <CheckNoIcon color={checkColor}/>}
						</IconButton>}
				/>)
		}

		let uploadList = null, completed = Object.keys(this.state.completed);
		if (completed.length > 0) {
			uploadList = completed.map((key) =>
				<div style={{display: 'flex'}} key={"uploading-container-"+key}>
					<ListItem
						key={"uploading-"+key}
						primaryText={key}
						disabled={true}
						leftIcon={fileIconFromTitle(key)}
						/>
					<div key={"uploading-progress-container"+key} 
						 style={{width: "100%", marign: 'auto', paddingTop: '22'}}
					>
					<LinearProgress 
						mode="determinate" 
						key={"uploading-progress-"+key} 
						value={this.state.completed[key]} 
					/>
					</div>
					<ListItem
						key={"uploading-number-"+key}
						primaryText={this.state.completed[key]+"%"}
						disabled={true}
						/>
				</div>
			)
		}

	    return (
	        <div className="mediaManager">
	          {this.renderTrigger()}
	          <Dialog
	            contentStyle={{minHeight: 500}}
	            titleStyle={{padding: 5}}
	            title={renderDialogTitle(
							<Subheader style={{maxHeight: 48}}>
			      				<div style={{display: 'flex'}}>
								<div style={{paddingTop: 8, paddingRight: 10}}>
									{(this.props.mode === MediaManagerMode.upload) ?
										<MediaManagerIcon color={titleIconColor} />:
										<Media color={titleIconColor}/>
									}
								</div>
								<div style={{fontSize: 20,}}>
			      					{(this.props.mode === MediaManagerMode.upload) ?
			      					"Media Manager" :
			      					"Pick your resources"}
			      				</div>
			      				</div>
		      				</Subheader>,
							this.handleClose,
							null
				)}
	            actions={this.renderActions()}
	            modal={true}
	            open={this.state.open}
	            onRequestClose={this.handleClose}
	            autoScrollBodyContent={true}
	          >
				<Dropzone
					disableClick
					onDrop={this.onDrop.bind(this)}
					onDragEnter={this.handleEnter}
					onDragLeave={this.handleExit}
					style={{width:"100%", minHeight: '200px', position: 'relative'}}>
					<List>
					{mediaList}
					{uploadList}
					</List>
					{this.state.dropzoneActive && <div style={overlayStyle}>Drop files...</div>}
				</Dropzone>
	          </Dialog>
	          <Notification />
	        </div>
	    )
	  }
}
