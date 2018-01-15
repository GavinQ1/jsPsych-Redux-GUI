import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';

import { ListItem } from 'material-ui/List';
import { GridTile } from 'material-ui/GridList';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'; // , ToolbarSeparator, ToolbarTitle

import Save from 'material-ui-icons/Save';
import New from 'material-ui-icons/NoteAdd';
import SaveAs from 'material-ui-icons/ContentCopy';
import DIYDeploy from 'material-ui-icons/Work';
import {
  cyan500 as hoverColor,
  grey100 as dialogBodyColor
} from 'material-ui/styles/colors';

import InitEditor from '../../containers/Appbar/jsPsychInitEditor';
import UserMenu from '../../containers/Appbar/UserMenu';
import MediaManager from '../../containers/MediaManager';

import ConfirmationDialog from '../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../gadgets';

import './Appbar.css';

const Actions = {
  save: "SAVE",
  saveAs: "SAVEAS"
}

export default class Appbar extends React.Component {
  state = {
    saveAsOpen: false,
    saveAsName: '',
    saveAsNameError: '',

    performing: null,
    confirmOpen: false,
    confirmMessage: "Null",
    proceedWithOperation: () => {},
    proceedWithOperationLabel: "Yes",
    proceed: () => {},
    proceedLabel: "No",

    total: 0,
    loaded: [],
    percent: 0,
  }

  setPerforming = (p) => {
    this.setState({
      performing: p
    });
  }

  progresHook = (loadedInfo, total, onFinish=false) => {
    if (onFinish) {
      this.setState({
        loaded: [],
        total: 0,
      })
      return;
    }
    let loaded = this.state.loaded.slice();
    loaded[loadedInfo.index] = loadedInfo.value;

    let percent = loaded.reduce((sum, val) => (sum+val), 0) / total * 100;
    this.setState({
      loaded: loaded,
      total: total,
      percent: (percent > 100) ? 100 : parseInt(percent, 10)
    });
  }

  handleSaveAsOpen = () => {
    this.setState({
      saveAsOpen: true,
      saveAsName: this.props.experimentName
    })
  }

  handleSaveAsClose = () => {
    this.setState({
      saveAsOpen: false,
      saveAsName: '',
      saveAsNameError: '',
    })
  }

  setSaveAsName = (e, n) => {
    this.setState({
      saveAsName: n,
      saveAsNameError: (/\S/.test(n)) ? '' : "New experiment name can't be empty."
    })
  } 

  handleConfirmClose = () => {
    this.setState({
      confirmOpen: false
    })
  }

  popUpConfirm = (message, proceedWithOperation, proceedWithOperationLabel, proceed, proceedLabel) => {
    this.setState({
      confirmOpen: true,
      confirmMessage: message,
      proceedWithOperation: proceedWithOperation,
      proceedWithOperationLabel: proceedWithOperationLabel,
      proceed: proceed,
      proceedLabel: proceedLabel,
    })
  }

	render() {
    const saveAsCallback = () => {
      if (this.state.saveAsNameError === '') {
        this.props.saveAs(
          this.state.saveAsName,
          () => {
            this.setPerforming(Actions.saveAs);
          }, () => {
            this.setPerforming(null);
          });
      }
      this.handleSaveAsClose();
    }

    let isBundling = this.state.total !== 0;

		return (
      		<div className="Appbar" draggable={false} >
  						<div className="App-Logo" >
                <img src='./jsPsych/jspsych-logo-readme.jpg' />
              </div>
        			<div className="Appbar-main">
          			<div className="Appbar-info">
  								<UserMenu />
  								<TextField
    								id="Experiment-Name-Textfield"
                    value={this.props.experimentName}
                    errorText={(/\S/.test(this.props.experimentName)) ? '' : "Experiment name can't be empty."}
    								onChange={this.props.changeExperimentName}
                    />
  							</div>
  							<Toolbar className="Appbar-tools" style={{backgroundColor: 'white', flexGrow: '1'}}>
                  <ToolbarGroup firstChild={true}>
                    <InitEditor />
                    <ToolbarSeparator />
                    <IconButton 
                      tooltip="New Experiment"
                      onTouchTap={() => { this.props.newExperiment(this.popUpConfirm); }}
                      > 
                      <New hoverColor={hoverColor} />
                    </IconButton>
                    {(this.state.performing === Actions.save) ?
                      <CircularProgress size={30}/> :
                      <IconButton 
                        tooltip="Save"
                        onTouchTap={() => { this.props.save(()=>{
                          this.setPerforming(Actions.save);
                        }, () => {
                          this.setPerforming(null);
                        });}}
                      > 
                        <Save hoverColor={hoverColor} />
                      </IconButton>
                    }
                    {(this.state.performing === Actions.saveAs) ?
                      <CircularProgress size={30}/> :
                      <IconButton 
                        tooltip="Save As"
                        onTouchTap={() => { this.props.saveAsOpen(this.handleSaveAsOpen); }}
                        > 
                        <SaveAs hoverColor={hoverColor} />
                      </IconButton>
                    }
                    <ToolbarSeparator />
										
                    <MediaManager />
                    
                    <ToolbarSeparator />
                    {isBundling ?
                      <div style={{display:'flex', paddingLeft: 10}}>
                        <div style={{paddingTop: 10}}><CircularProgress size={30} value={this.state.percent} mode="determinate"/></div>
                        <ListItem primaryText={this.state.percent+"%"} disabled={true}/>
                      </div>:
                    <IconButton
                      tooltip="DIY Deploy"
                      onTouchTap={() => { 
                        this.props.diyDeploy(this.progresHook);
                      }}
                      >
                      <DIYDeploy hoverColor={hoverColor} />
                    </IconButton>
                    }
                  </ToolbarGroup>
  							</Toolbar>
  						</div>

              <ConfirmationDialog
                open={this.state.confirmOpen}
                message={this.state.confirmMessage}
                handleClose={this.handleConfirmClose}
                proceedWithOperation={this.state.proceedWithOperation}
                proceedWithOperationLabel={this.state.proceedWithOperationLabel}
                proceed={this.state.proceed}
                proceedLabel={this.state.proceedLabel}
                />

              <Dialog
                open={this.state.saveAsOpen}
                onRequestClose={this.handleSaveAsClose}
                titleStyle={{padding: 0}}
                title={renderDialogTitle(<Subheader></Subheader>, this.handleSaveAsClose, null)}
                contentStyle={{width: 450, height: 300, padding: 0}}
                bodyStyle={{backgroundColor: dialogBodyColor}}
                actions={[
                  <FlatButton
                    label="Save As"
                    labelStyle={{
                      textTransform: "none",
                    }}
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={saveAsCallback}
                  />,
                  <FlatButton
                    label="Cancel"
                    labelStyle={{
                      textTransform: "none",
                    }}
                    secondary={true}
                    onTouchTap={this.handleSaveAsClose}
                  />
                ]}
              >
              <div style={{width: 400, margin: 'auto'}}
                onKeyPress={(e)=>{
                  if (e.which === 13) {
                    saveAsCallback();
                  }
                 }}
              >
                <TextField
                  id="Save-as-new-experiment-name"
                  floatingLabelFixed={true}
                  floatingLabelText="New experiment name"
                  value={this.state.saveAsName}
                  errorText={this.state.saveAsNameError}
                  onChange={this.setSaveAsName}
                  fullWidth={true}
                />
              </div>
              </Dialog>
  					</div>
		   )
	}

}
