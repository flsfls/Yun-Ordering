import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../views/Home';
import Login from '../views/Login';
import Test from '@views/test'; // eslint-disable-line


export default () => [
  <Route path="/" component={Login} key="Login" />,
  <Route path="/home" component={Home} key="Home" />,
  <Route path="/test" component={Test} key="test" />,
];
