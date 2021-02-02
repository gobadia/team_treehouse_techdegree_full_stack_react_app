import React, {useState, useContext} from 'react';
import {
    useHistory
  } from 'react-router-dom';
import { posttoapi } from '../apiRequests';
import {AuthContext} from '../Context';

const CreateCourse = () => {
    const history = useHistory();

    let [validationErrors, setvalidationErrors] = useState(null);
    let context = useContext(AuthContext);

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [estTime, setEstTime] = useState(null);
    const [materials, setMaterials] = useState(null);

    const handleChange = (event)=>{
        //use an object to match field to state setting function
        const fields = {title: setTitle, description: setDescription, estimatedTime: setEstTime, materialsNeeded: setMaterials};
        //sets the state of each field using object
        fields[event.target.name](event.target.value);
    }

    async function handleSubmit(event) {
       try{ 
            event.preventDefault();
            let body = {
                title,
                description,
                'estimatedTime': estTime? estTime : null,
                'materialsNeeded': materials? materials : null,
                'userId': context.authenticatedUser.id
            }
            // post form entry to api
            let result = await posttoapi(body, context.authenticatedUser);
            console.log(result);
            if(result.data.errors){
                //if error set validation state
                setvalidationErrors(result.data.errors);
            }
            else if(result.status = 500){
              history.push('/error')
            }

            //navigate user to created course
            history.push(result.headers.location);
            return result;
        }
        catch(e){
          console.log('CAUGHT');
            if(e.response.status === 404){
                history.push('/notfound')
            }
            else{
                history.push('/error')
            }
        }
    }

    return (
        <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          { 
              /* show validation errors if present */
              validationErrors? 
                <div>
                    <h2 className="validation--errors--label">Validation errors</h2>
                    <div className="validation-errors">
                    <ul>
                        {validationErrors.map(error => <li>{error}</li>)}
                    </ul>
                    </div>
                </div>
            : null
          }
          <form onSubmit={handleSubmit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    onChange={handleChange} />
                </div>
                <p>{`By ${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`}</p>
              </div>
                <div className="course--description">
                    <div>
                        <textarea id="description" name="description" className="" placeholder="Course description..." onChange={handleChange}></textarea>
                    </div>
                </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" onChange={handleChange} />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={handleChange}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button><button className="button button-secondary">Cancel</button></div>
          </form>
        </div>
      </div>
    )
}

export default CreateCourse
