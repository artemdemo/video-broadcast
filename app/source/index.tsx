import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import './styles/general.less';

import history from './history';
import store from './store';

import AppView from './views/components/AppView';

render(
    <Provider store={store}>
        <Router history={history}>
            <AppView />
        </Router>
    </Provider>,
    document.getElementById('app'),
);
