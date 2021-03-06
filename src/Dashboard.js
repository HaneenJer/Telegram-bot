import React, {Fragment, useEffect, useState} from "react";
import {getUser, removeUserSession, setPoll} from './Utils/Common';
import axios from 'axios';

import './Dashboard.css';
import {Button, TextField} from "@material-ui/core";
import {FiLogOut} from "react-icons/fi";
import {AiOutlineUserAdd} from "react-icons/ai";
import {BiStats, BiPoll} from "react-icons/bi";

// const baseUrl = "http://localhost:5000"

function Dashboard(props) {
    const [adminsList, setAdminsList] = useState([]);
    const [pollsList, setPollsList] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const pollId = useFormInput('');

    const fetchAdmins = async () => {
        try {
            const data = await axios.get('http://localhost:5000/admins');
            const {admins} = data.data
            setAdminsList(admins);
        } catch (err) {
            console.error(err.message);
        }
    };


    const fetchPolls = async () => {
        try {
            console.log(user.name)
            console.log('admin')
            const data = await axios.get('http://localhost:5000/polls', {params: {username: user.username}});
            const {polls} = data.data
            setPollsList(polls);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchPolls();
        // fetchPolls().then(r => pollsList);
    }, []);

    const user = getUser();

    // handle click event of logout button
    const handleLogout = () => {
        removeUserSession();
        props.history.push('/login');
    }

    // handle click event of add new admin button
    const handleAddAdmin = async () => {
        const admin = {username, password}
        await axios.post('http://localhost:5000/admins', admin)
        await fetchAdmins();
    }

    const handleAddNewPoll = () => {
        props.history.push('/addPoll')
    }

    const handleViewPoll = () => {
        setPoll(pollId.value);

        props.history.push('/myPoll');
    }

    return (
        <Fragment>
            <div>
                Welcome {user.name}!<br/><br/>
                <p align="right">
                    <Button variant="contained" color={"primary"} type="Logout"
                            onClick={handleLogout} endIcon={<FiLogOut/>}>
                        Logout!
                    </Button>
                </p>
                <br/><br/>
            </div>
            {" "}
            <div className="grid-container">
                <div align="center">
                    <h3> Existing admins table:</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>username</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adminsList.map(admin => (
                            <tr key={admin.name}>
                                <td>{admin.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <br/>
                    <div>
                        <TextField name="username" label={"username"}
                                   onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div style={{marginTop: 10}}>
                        <TextField name="password" label={"password"}
                                   onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <br/>
                    <Button variant="contained" color={"primary"}
                            onClick={handleAddAdmin} endIcon={<AiOutlineUserAdd/>}>
                        Add new admin
                    </Button>
                </div>
                <div align="center">
                    <div className='my_poll'>
                        <h3> My Polls:</h3>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>polls</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pollsList.map(polls => (
                            <tr key={polls.poll_id}>
                                <td>{polls.poll_id}</td>
                                <td>{polls.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <br/>
                    <TextField className={'pollIdClass'} name="poll id" label={"poll id"}
                               {...pollId}/>
                    <br/>
                    <Button variant="contained" color={"primary"}
                            onClick={handleViewPoll} endIcon={<BiStats/>}>
                        view poll statistics
                    </Button>
                    <br/><br/>
                    <Button variant="contained" color={"primary"}
                            onClick={handleAddNewPoll} endIcon={<BiPoll/>}>
                        Add new poll
                    </Button>
                </div>
            </div>
        </Fragment>
    );
}

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    }
}

export default Dashboard;