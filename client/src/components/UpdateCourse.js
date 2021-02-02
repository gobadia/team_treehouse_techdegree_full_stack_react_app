import React, {useState, useEffect, useContext} from 'react';
import { useParams } from "react-router-dom";
import {
    useHistory
  } from 'react-router-dom';
import {AuthContext} from '../Context';

import {getfromapi, putToApi} from '../apiRequests';



const UpdateCourse = () => {

    let context = useContext(AuthContext);
    const history = useHistory();

    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estTime, setEstTime] = useState('');
    const [materials, setMaterials] = useState('');
    const [author, setAuthor] = useState('');

    //use effect to get the course data to update
    useEffect(()=>{
        async function getCourse(){
            try{
                //gets the course info
                let result = await getfromapi(id);
                //if the user isn't the author, redirect to forbidden
                if(result.User.id !== context.authenticatedUser.id){
                    history.push('/forbidden');
                }
                
                //set state for each field to include in text areas
                setTitle(result.title);
                setDescription(result.description);
                setEstTime(result.estimatedTime);

                //format materials for line breaks
                let formattedMaterials = result.materialsNeeded.replaceAll('* ', '\n');
                if(formattedMaterials.substring(0,1) === '\n'){
                    formattedMaterials = formattedMaterials.substring(1,);
                }
                setMaterials(formattedMaterials);

                setAuthor(`${result.User.firstName} ${result.User.lastName}`);
            }
            catch(e){
                console.log(`ERROR: ${e.response.status}`);
                if(e.response.status === 404){
                    history.push('/notfound')
                }
                else{
                    history.push('/error')
                }
            }
            
            
        }
        
        getCourse();

    },[id, context.authenticatedUser.id, history]);

    let [validationErrors, setvalidationErrors] = useState(null);
    

    const handleChange = (event)=>{
        //use object to match field to state setting function
        const fields = {title: setTitle, description: setDescription, estimatedTime: setEstTime, materialsNeeded: setMaterials};
        //sets the state of each field based on object
        fields[event.target.name](event.target.value);
    }

    //CHANGE TO HANDLE UPDATE 
    async function handleSubmit(event) {
        event.preventDefault();

        let body = {
            title,
            description,
            'estimatedTime': estTime? estTime : null,
            'materialsNeeded': materials? materials : null,
            'userId': context.authenticatedUser.id
        }
        //update course
        try{
            let result = await putToApi(id, body, context.authenticatedUser);
            if(result.errors){
                setvalidationErrors(result.errors);
                return;
            }
            history.push(`/courses/${id}`);
            return result;
        }
        catch(e){
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
        <h1>Update Course</h1>
        <div>
          {validationErrors? 
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
                    <input id="title" name="title" type="text" className="input-title course--title--input"
                    value={title} onChange={handleChange} />
                </div>
                <p>{`By ${author}`}</p>
              </div>
                <div className="course--description">
                    <div>
                        <textarea id="description" name="description" className="" placeholder="Course description..." value={description} onChange={handleChange}></textarea>
                    </div>
                </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" value={estTime} onChange={handleChange} />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={materials} onChange={handleChange}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={()=>{history.goBack()}}>Cancel</button></div>
          </form>
        </div>
      </div>
    )
}

export default UpdateCourse
