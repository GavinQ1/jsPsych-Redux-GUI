import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import ExperimentIcon from 'material-ui/svg-icons/action/book';
import SignOut from 'material-ui/svg-icons/action/exit-to-app';
import {
  indigo500 as hoverColor,
  cyan500 as iconColor,
} from 'material-ui/styles/colors';

import Login from '../../../containers/Login';
import ExperimentList from '../../../containers/Appbar/ExperimentList';

export default class UserMenu extends React.Component {
  state = {
      open: false,
      experimentListOpen: false,
  }


  handleTouchTap = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  openExperimentList = () => {
    this.setState({
      experimentListOpen: true
    })
  }

  closeExperimentList = () => {
    this.setState({
      experimentListOpen: false
    })
  }

  renderMenu = (login) => {
    if (!login) {
      return (
        <Menu>
            <MenuItem
              primaryText={"Sign In"}
              onTouchTap={() => { this.props.handleSignIn(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Create Account"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
        </Menu>
      )
    } else {
      return (
        <Menu>
            <MenuItem
              primaryText={"Profile"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Experiments"}
              leftIcon={<ExperimentIcon hoverColor={hoverColor} color={iconColor} />}
              onTouchTap={() => { this.openExperimentList(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Sign Out"}
              leftIcon={<SignOut hoverColor={hoverColor} color={iconColor} />}
              onTouchTap={() => { this.props.handleSignOut(); this.handleRequestClose(); }} />
        </Menu>
      )
    }
  }

  render() {
    let login = this.props.username !== null;
    let buttonLabel = (!login) ? 'Your Account' : this.props.username;

    return (
      <div>
      <div style={{float: 'right', paddingRight: 1}}>
        <MenuItem 
          primaryText={buttonLabel} 
          onTouchTap={this.handleTouchTap} 
          style={{textDecoration: (login) ? 'none' : 'none'}}
        />
      </div>
       <Login />
       <ExperimentList 
        open={this.state.experimentListOpen} 
        handleOpen={this.openExperimentList}
        handleClose={this.closeExperimentList}
       />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={{horizontal:"right",vertical:"bottom"}}
          targetOrigin={{horizontal:"right",vertical:"top"}}
          >
          {this.renderMenu(login)}
        </Popover>
    </div>
    )
  }
}
