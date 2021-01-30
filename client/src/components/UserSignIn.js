import React, {useContext, useState, useRef} from 'react';
import {
    Link,
    useHistory,
    useLocation
  } from 'react-router-dom';

import {AuthContext} from '../Context';

const UserSignIn = () => {
    //gets URL that redirected user to signin or sets it to Course page
    const { state } = useLocation();
    const { from } = state || { from: { pathname: "/" } };

    let [email, setEmail] = useState(null);
    let [pass, setPass] = useState(null);
    const [validationErrors, setValidation] = useState(null);

    const context= useContext(AuthContext);
    const history = useHistory();
    let passValue = useRef(null);

    const handleChange = (event)=>{
        const fields = {emailAddress: setEmail, password: setPass};
        //sets the state of either email or password based on field changed
        fields[event.target.name](event.target.value);
    }

    const handleCancel = ()=>{
        //bring user back to Course page if canceled
        history.push('/');
    }

    const handleSignIn = async (event)=>{
        event.preventDefault();
        try{
            await context.actions.signIn(email, pass);
            
            //redirect user to last page or course page
            history.push(from.pathname);
        }
        catch(e){
            //Login info incorrect
            //reset password field
            passValue.current.value = '';
            //add validation error
            setValidation(['Login information incorrect. Please try again.'])
        }
        
    }
    
    return (
        <div className="bounds">
            <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                {validationErrors? 
                <div>
                    <h2 className="validation--errors--label">Validation errors</h2>
                    <div className="validation-errors">
                    <ul>
                        {validationErrors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                    </div>
                </div>
            : null
          }
                <div>
                    <form onSubmit={handleSignIn}>
                    <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={handleChange}/></div>
                    <div><input id="password" name="password" type="password" className="" placeholder="Password" ref={passValue} onChange={handleChange} /></div>
                    <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button></div>
                    </form>
                </div>
                <p>&nbsp;</p>
                <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
            </div>
      </div>
    )
}

export default UserSignIn
