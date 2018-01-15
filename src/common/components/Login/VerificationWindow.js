import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

import Verified from 'material-ui-icons/VerifiedUser';
import Sent from 'material-ui-icons/CheckCircle';
import {
  green500 as verifyColor
} from 'material-ui/styles/colors';

let Modes = {
  ready: 0,
  processing: 1,
  success: 2,
}

import { verify, resendVerification} from '../../backend/cognito';

export default class VerificationWindow extends React.Component {
  state = {
    code: '',
    codeError: '',
    mode: Modes.ready,
    open: false,
    message: '',
  }

  handleSnackbarClose = () => {
    this.setState({
      open: false,
    });
  }

  handleSnackbarOpen = () => {
    this.setState({
      open: true,
    });
  }

  handleCodeChange = (e, newVal) => {
    this.setState({
      code: newVal,
    });
  }

  handleCodeError = (m) => {
    this.setState({
      codeError: m
    });
  }

  handleModeChange = (mode) => {
    this.setState({
      mode: mode
    });
  }

  handleVerification = () => {
    this.handleModeChange(Modes.processing);
    verify(this.props.username, this.state.code, (err, result) => {
      if (err) {
        this.handleModeChange(Modes.ready);
        this.handleCodeError(err.message);
        return;
      }
      if (result === 'SUCCESS') {
        this.handleModeChange(Modes.success);
        this.handleCodeError('');
        this.props.signIn((err) => {
          this.props.notifyError(err.message);
        }, true)
      }
    });
  }

  resendVerificationCode = () => {
    this.handleCodeChange(null, '');
    this.handleSnackbarOpen(); 
    resendVerification(this.props.username, (err, result) => {
      if (err) {
        this.props.notifyError(err.message);
        return;
      }
    });
  }

  renderVerifcationButton = () => {
    switch(this.state.mode) {
      case Modes.processing:
        return (
          <CircularProgress />
        );
      case Modes.success:
        return (
          <FlatButton
            labelStyle={{textTransform: "none", }}
            label="User Verified"
            icon={<Verified color={verifyColor} />}
          />
        );
      case Modes.ready:
      default:
        return (
          <RaisedButton 
                label="Verify Email Address" 
                primary={true} 
                onTouchTap={this.handleVerification} 
                fullWidth={true}
          />
        );
    }
  }

  render(){
    return(
      <div >
        <Snackbar
            open={this.state.open}
            message={ 
              <MenuItem 
                primaryText="Verification code was resent."
                style={{color: 'white' }}
                disabled={true}
                rightIcon={<Sent color={verifyColor} />} 
              /> 
            }
            autoHideDuration={2500}
            onRequestClose={this.handleSnackbarClose}
          />
        <p>Your account won't be created until you enter the vertification code that you receive by email. Please enter the code below.</p>
        <div 
          style={{width: 300, margin: 'auto'}}
        >
          <TextField 
            id="verificationCode" 
            fullWidth={true}
            floatingLabelText="Verification Code" 
            errorText={this.state.codeError} 
            value={this.state.code} 
            onChange={this.handleCodeChange}
               onKeyPress={(e)=>{
                  if (e.which === 13) {
                    this.handleVerification();
                  }
               }}
            />

          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}   
          >
            {
              this.renderVerifcationButton()
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
            <FlatButton 
              label="Resend Verification Code" 
              secondary={true} 
              labelStyle={{textTransform: "none", }}
              onTouchTap={this.resendVerificationCode} 
            />
          </div>
        </div>
      </div>
    )
  }
}
