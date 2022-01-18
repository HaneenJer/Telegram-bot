import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route, NavLink} from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import MyPoll from "./MyPoll";
import AddPoll from "./addPoll";

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import {getToken, removeUserSession, setUserSession} from './Utils/Common';


function App() {
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }

        axios.get(`http://localhost:4000/verifyToken?token=${token}`).then(response => {
            setUserSession(response.data.token, response.data.user);
            setAuthLoading(false);
        }).catch(error => {
            removeUserSession();
            setAuthLoading(false);
        });
    }, []);

    if (authLoading && getToken()) {
        return <div className="content">Checking Authentication...</div>
    }

    return (
        <div className="App">
            <BrowserRouter>
                <div>
                    <div className="header">
                        <NavLink exact activeClassName="active" to="/">Home</NavLink><small>(Public page)</small>
                        <NavLink activeClassName="active" to="/login">Login</NavLink><small>(Public page)</small>
                        <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink><small>(Private
                        page)</small>
                        <NavLink activeClassName="active" to="/myPoll">MyPoll</NavLink><small>(Private page)</small>
                        <NavLink activeClassName="active" to="/addPoll">Add Poll</NavLink><small>(Private page)</small>
                    </div>
                    <div className="content">
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <PublicRoute path="/login" component={Login}/>
                            <PrivateRoute path="/dashboard" component={Dashboard}/>
                            <PrivateRoute path="/myPoll" component={MyPoll}/>
                            <PrivateRoute path="/addPoll" component={AddPoll}/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
