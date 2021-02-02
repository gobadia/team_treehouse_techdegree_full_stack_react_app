import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    useHistory
  } from 'react-router-dom';

import {
    Link
} from 'react-router-dom';


const Courses = () => {
    const [courses, setCourses] = useState([]);
    const history = useHistory();

    

    //use effect to handle updating of courses when courses are deleted or added
    useEffect(()=>{
        //function to get all courses from api
        const courseResults = async()=>{
            try{
                let results = await axios.get('http://localhost:5000/api/courses');
                setCourses(results.data);
            }
            //handle errors getting courses
            catch(e){
                if(e.response && e.response.status === 404){
                    history.push('/notfound')
                }
                else{
                    history.push('/error')
                }
            }
        }
        courseResults();
      }, [history]);
      
    return (
        <div className='bounds'>
            {
                courses.map((course)=>(
                    <div className="grid-33" key={course.id}>
                        <Link className="course--module course--link" to={`/courses/${course.id}`}>
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                        </Link>
                    </div>
                   
                ))
            }
            <div className="grid-33"><a className="course--module course--add--module" href="courses/create">
                <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 13 13" className="add">
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                </svg>New Course</h3>
            </a></div>
        </div>
    )
}

export default Courses
