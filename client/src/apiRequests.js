
import axios from 'axios';

//Gets a specific course from api
const getfromapi = async(id)=>{
    let url = 'http://localhost:5000/api/courses';
    if(id){
        url = `${url}/${id}`;
    }

    let results = await axios.get(url);
    return results.data;
};

//Update a course
const putToApi = async (id, body, user) =>{
    let url = 'http://localhost:5000/api/courses';
    if(id){
        url = `${url}/${id}`;
    }
    const headers= {
        headers:{
            'Authorization': `Basic ${user.authHeader}` ,
        }
    }

    let results = await axios.put(url, body, headers)
            .catch((error)=>{
                if (error.response) {
                // Request made and server responded
                    return error.response;
                }
        });

    return results;
};

const deleteFromApi = async(id, user)=>{
    let url = 'http://localhost:5000/api/courses';
    if(id){
        url = `${url}/${id}`;
    }

    const headers= {
        headers:{
            'Authorization': `Basic ${user.authHeader}` ,
        }
    }

    let results = await axios.delete(url, headers);
    return results;
};

//Create a course
const posttoapi = async(body, user)=>{
    

    let url = 'http://localhost:5000/api/courses';
    
    const headers= {
        headers:{
            'Authorization': `Basic ${user.authHeader}` ,
        }
    }

    let results = await axios.post(url, body, headers)
           .catch((error)=>{
                if (error.response) {
                // Request made and server responded
                    return error.response;
                }
    });
    return results;
   
    
};

const createUser = async (body) =>{
    let url = 'http://localhost:5000/api/users';

    let results = await axios.post(url, body)
           .catch((error)=>{
                if (error.response) {
                // Request made and server responded
                    return error.response;
                }
    });
    return results;
}


export { getfromapi, posttoapi, putToApi, deleteFromApi, createUser}

