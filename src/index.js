import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './assets/scss/common.scss';
import './assets/scss/iconfont.css';
import './assets/scss/button.scss';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
