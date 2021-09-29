/* Info: This file acts as a wrapper for the appliction */
/* Created on {3-07-19} By {React-cli}*/
/* Modified on {11-07-19} By {Siddhant Chopra}*/

import React from 'react';
import { Provider } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { store } from './store/configureStore';
import TokenValid from './TokenValid'
import ErrorBoundry from './ErrorBoundry'
function App() {
  window.jQuery(window).on('popstate', function () {
    window.jQuery(".modal").modal('hide');
  });

  return (
    <div id="wrapper" className="background_bg">
    <ErrorBoundry>
    <Provider store={store}>
          <LoadingBar
            updateTime={200}
            maxProgress={95}
            progressIncrease={5}
            showFastActions
            style={{ backgroundColor: '#555FF6', zIndex: '6', position: 'fixed',height:"5px" }}
          />
          <TokenValid />
        </Provider>
    </ErrorBoundry>
       

    </div>
  );
}

export default App;
