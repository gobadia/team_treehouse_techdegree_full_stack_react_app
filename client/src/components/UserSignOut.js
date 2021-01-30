import React, {useContext, useEffect} from 'react';
import {
    useHistory
  } from 'react-router-dom';
import {AuthContext} from '../Context';

const UserSignOut = () => {
    const history = useHistory();
    const context= useContext(AuthContext);
    //signout function when clicked runs signout function then redirects to home page
    useEffect(()=>{
        context.actions.signOut();
        history.push('/');
    },[context.actions, history])

    return (
        <p>Signing Out</p>
    )
      
    
        
   
}

export default UserSignOut
