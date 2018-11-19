import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import './index.css';
import 'moment/locale/de';
import moment from 'moment';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <MuiPickersUtilsProvider utils={MomentUtils} locale='de' moment={moment}>
      <App />
    </MuiPickersUtilsProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
