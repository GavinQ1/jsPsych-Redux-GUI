import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import rootReducer from '../common/reducers';
import App from '../common/containers/AppContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { signIn } from '../common/containers/Login';
import { getUserInfoFromCognito, fetchCredential } from '../common/backend/cognito';

var deepEqual = require('deep-equal');


const store = createStore(rootReducer, applyMiddleware(thunk));

window.addEventListener('load', () => {
	fetchCredential(null, () => {
		let userLoginInfo = getUserInfoFromCognito();
		if (userLoginInfo &&
			userLoginInfo.username &&
			userLoginInfo.identityId) {
			signIn(store.dispatch);
		}
	});
});

window.addEventListener('beforeunload', (e) => {
	let { userState, experimentState } = store.getState();
	// new 
	if (!deepEqual(userState.lastModifiedExperimentState, experimentState)) {
		e.returnValue = true;
		return true;
	}
});

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}>
	<MuiThemeProvider>
  		<App />
  	</MuiThemeProvider>
  </Provider>,
  document.getElementById('container')
);