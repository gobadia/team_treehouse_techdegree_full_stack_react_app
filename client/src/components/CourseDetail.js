import React, {useEffect, useState, useContext} from 'react';
import {
    useHistory
  } from 'react-router-dom';
import ReactMarkdown from "react-markdown";


import { Link, useParams } from "react-router-dom";
import {getfromapi, deleteFromApi} from '../apiRequests';
import {AuthContext} from '../Context';



const CourseDetail = () => {
    let context = useContext(AuthContext);
    const history = useHistory();

    const { id } = useParams();
    let [course, setCourse] = useState('');

    //status if user is the course user, default to false
    const [isAuthor, setIsAuthor]= useState(false);

    
         
    useEffect(()=>{
        async function getCourse(){
            try{
                let result = await getfromapi(id);
                setCourse(result);
            }
            catch(e){
                // if course not found
                if(e.response && e.response.status === 404){
                    console.log(`ERROR: ${e.response.status}`);
                    history.push('/notfound')
                }
                else{
                    //handle other errors with error page
                    history.push('/error')
                }
            }
        }

        getCourse();
    },[id, history]);

    useEffect(()=>{
        //if user is the course creator, allow set state so they can edit the course
        if(course && context.authenticatedUser && course.User.id === context.authenticatedUser.id){
            setIsAuthor(true);
        }
    },[course, context.authenticatedUser])

    const handleDelete= async ()=>{
        await deleteFromApi(id,context.authenticatedUser);
        history.push('/')
        
    }

    const handleUpdate = ()=>{
        context.setCurrentCourse(course);
        history.push(`/courses/${id}/update`);
    }

    return (
        <div>
            <div className='actions--bar'>
                <div className='bounds'>
                    <div className="grid-100">
                    { isAuthor ?
                        <span key={id}>
                            <button className="button" onClick={handleUpdate}>Update Course</button>
                           <button className="button" onClick={handleDelete}>Delete Course</button>
                        </span>
                        :
                            null
                    }
                            <Link className="button button-secondary" to="/">Return to List</Link>
                    </div>
                </div>
            </div>
            { course?
                <div className='bounds course--detail'>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            <p>By {course.User.firstName} {course.User.lastName}</p>
                            </div>
                            <div className="course--description">
                                <ReactMarkdown source={course.description} />
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <h3>{course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ReactMarkdown source={course.materialsNeeded} />  
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>
                
                : null
            }
        </div>
    )
}

export default CourseDetail
