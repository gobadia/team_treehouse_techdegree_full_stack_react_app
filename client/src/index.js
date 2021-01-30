import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {UserContext} from './Context';

ReactDOM.render(
  <React.StrictMode>
   {/* <AuthContext.Provider value={UserContext}> */}
   <UserContext >
      <App />
    </UserContext>
    {/* </AuthContext.Provider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

