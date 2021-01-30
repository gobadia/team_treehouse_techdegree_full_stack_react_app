import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';
import Error from './components/Error';
import Forbidden from './components/Forbidden';

import PrivateRoute from './PrivateRoute';



function App() {
  
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Courses} />
        <PrivateRoute path="/courses/create" component={CreateCourse} />
        <Route exact path="/courses/:id" component={CourseDetail} />
        <PrivateRoute path="/courses/:id/update" component={UpdateCourse} />
        <Route path="/signin" component={UserSignIn} />
        <Route path="/signup" component={UserSignUp} />
        <Route path="/signout" component={UserSignOut} />
        <Route path="/error" component={Error} />
        <Route path="/notfound" component={NotFound} />
        <Route path="/forbidden" component={Forbidden} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
