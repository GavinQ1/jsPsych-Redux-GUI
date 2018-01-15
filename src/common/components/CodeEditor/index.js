import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';

import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');

import ButtonIcon from 'material-ui-icons/Code';
import Uncheck from 'material-ui-icons/StarBorder';
import Check from 'material-ui-icons/Star';
// import DialogIcon from 'material-ui-icons/Create';
import {
  cyan500 as hoverColor,
  grey800 as normalColor,
  yellow500 as checkColor,
  // blue500 as titleIconColor,
} from 'material-ui/styles/colors';
import { renderDialogTitle } from '../gadgets';

export default class CodeEditor extends React.Component {
  static propTypes = { 
    submitCallback: PropTypes.func,
    openCallback: PropTypes.func,
  	initCode: PropTypes.string,
  	buttonIcon: PropTypes.object,
    title: PropTypes.string,
    showEditMode: PropTypes.bool,
    useFunc: PropTypes.bool,
    setParamMode: PropTypes.func
  };

  static defaultProps = { 
  	initCode: "",
    tooltip: "Insert code",
  	buttonIcon: (<ButtonIcon color={normalColor} hoverColor={hoverColor} />),
    title: "Code Editor",
    openCallback: function() { return; },
    closeCallback: function() { return; },
    submitCallback: function(newCode) { return; },
    showEditMode: false,
  };

  state = {
  	open: false,
    code: ""
  }


  handleOpen = () => {
  	this.setState({
  		open: true,
      code: this.props.initCode
  	});
    this.props.openCallback();
  }

  handleClose = () => {
  	this.setState({
  		open: false,
  	});
    this.props.closeCallback();
  }

  onUpdate = (newCode) => {
    this.setState({
      code: newCode
    });
  }

  render() {
  	const { buttonIcon, title, submitCallback, closeCallback } = this.props;
  	const actions = [
      <FlatButton
        label="Finish"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => { this.handleClose(); submitCallback(this.state.code); closeCallback(); }}
      />,
    ];

  	return (
  		<div>
	  		<IconButton onTouchTap={this.handleOpen} tooltip={this.props.tooltip}>
	  		 {buttonIcon}
	  		</IconButton>
	  		<Dialog
	            contentStyle={{minHeight: 500}}
              titleStyle={{padding: 0}}
	            title={renderDialogTitle(
                <Subheader style={{fontSize: 18, maxHeight: 48}}>
                {title}
                </Subheader>, 
                this.handleClose, 
                null)}
	            actions={actions}
	            modal={true}
	            open={this.state.open}
	            onRequestClose={this.handleClose}
	          >
            {(this.props.showEditMode) ?
              <div style={{display: 'flex'}}>
              <p style={{paddingTop: 15, color: (this.props.useFunc) ? 'blue' : 'black'}}>
                Use Custom Code:
              </p>
              <IconButton
                onTouchTap={this.props.setParamMode}
                >
                {(this.props.useFunc) ? <Check color={checkColor} /> : <Uncheck />}
                </IconButton>
              </div>:
              null
            }
	          <CodeMirror value={this.state.code} 
                        onChange={this.onUpdate} 
                        options={{lineNumbers: true}}
            />
	      </Dialog>
	    </div>
  	)
  }
}
