import React, { useContext } from 'react';
import {
    Link,
    NavLink
} from 'react-router-dom';
import {AuthContext} from '../Context';


const Header = () => {
    const context= useContext(AuthContext);
    
    return (
        <div className ='header'>
            <div className="bounds">
                <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                {
                    context.authenticatedUser?
                        <nav>{`Welcome, ${context.authenticatedUser.firstName}`}<NavLink className="signOut" to="/signout">Sign Out</NavLink></nav>    
                    :
                        <nav><NavLink className="signup" to="/signup">Sign Up</NavLink><NavLink className="signin" to="/signin">Sign In</NavLink></nav>
                }
            </div>
        </div>
    )
}

export default Header
