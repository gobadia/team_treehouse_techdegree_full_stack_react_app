import React, {useState} from 'react';
import {
    useHistory
  } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';


const AuthContext = React.createContext();

const UserContext = props => {
    const history = useHistory();
    
    let [authenticatedUser, setAuthenticatedUser] = useState(Cookies.getJSON('authenticatedUser') || null);
    let [currentCourse, setCurrentCourse] = useState(null);

    async function getUser(email, password) {
        const encodedCredentials = btoa(`${email}:${password}`);
        
        const headers= {
            headers:{
                'Authorization': `Basic ${encodedCredentials}` 
            }
        }
        try{
            const response = await axios.get(`http://localhost:5000/api/users`, headers);
            if (response.status === 200) {
                return response.data;
            }
            else if (response.status === 401) {
                return null;
            }
            else {
                history.push('/error');
                
            }
        }
        catch(e){
           history.push('/error');
        }
    }

    const signIn = async (email, password) => {
        const user = await getUser(email, password);
        if(user !== null){
            let auth = btoa(`${email}:${password}`);
            user.authHeader = auth;
            setAuthenticatedUser(user);//{...authenticatedUser, "authHeader": auth});
            Cookies.set('authenticatedUser', JSON.stringify(user),{expires: 1});
        }
        return user;
    }

    const signOut = () => {
        setAuthenticatedUser(null);
        Cookies.remove('authenticatedUser');
    } 

    const value = {
        authenticatedUser,
        actions: {
            signIn,
            signOut
        },
        currentCourse,
        setCurrentCourse
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
    
}
export {AuthContext , UserContext} ;
