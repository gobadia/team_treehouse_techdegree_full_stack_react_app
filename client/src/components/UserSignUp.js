import React, {useState, useContext} from 'react';
import {
    Link,
    useHistory
  } from 'react-router-dom';
import { createUser, } from '../apiRequests';
import {AuthContext} from '../Context';


const UserSignUp = () => {
    const history = useHistory();
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPass, setConfirmPass] = useState(null);

    const [validationErrors, setValidation] = useState(null);

    const context = useContext(AuthContext);

    const handleCancel = ()=>{
        history.push('/');
    }

    const handleChange = (event)=>{
        const fields = {firstName: setFirstName, lastName: setLastName, emailAddress: setEmail, password: setPassword, confirmPassword: setConfirmPass};
        //sets the state of either email or password based on field changed
        fields[event.target.name](event.target.value);
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(password !== confirmPass){
            //passwords don't match validation error
            setValidation(['Your passwords do not match. Please confirm your password'])
            return;
        }

        // if(validationErrors.length === 0){
            let body = {
                firstName: firstName,
                lastName: lastName,
                emailAddress: email,
                password: confirmPass
            }
            try{
                const results = await createUser(body);

                if(!results.data.errors){
                    //successfully created user
                    //Sign them in then go to course list
                    try{
                        await context.actions.signIn(email, body.password);
                        history.push('/');
                    }
                    catch(e){
                        console.log("can't sign in");
                    }
                }
                else{
                    //has validation errors
                    setValidation(results.data.errors);
                }
            }
            catch(e){
                if(e.response.status === 404){
                    history.push('/notfound')
                }
                else{
                    history.push('/error')
                }
            }
            

        // }
    }

    return (
        <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
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
            <form>
              <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" onChange={handleChange} /></div>
              <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" onChange={handleChange} /></div>
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={handleChange} /></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" onChange={handleChange} /></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
                  onChange={handleChange}/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={handleSubmit}>Sign Up</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
        </div>
      </div>
    )
}

export default UserSignUp
