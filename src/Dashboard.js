import React, {Fragment, useEffect, useState} from "react";
import {getUser, removeUserSession, setUserSession,setPoll} from './Utils/Common';
import axios from 'axios';

import './Dashboard.css';

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
            const data = await axios.get('http://localhost:5000/polls', user.name);
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
        props.history.push(user.name+'/addPoll')
    }

    const handleViewPoll = () => {
        setPoll(pollId.value);

        props.history.push('/myPoll');
    }

    return (
        <Fragment>
            <div >
                Welcome {user.name}!<br/><br/>
                <p align="right">
                    <input type="button" onClick={handleLogout} value="Logout" align="right"/>
                </p>
                <br/><br/>
            </div>
            {" "}
            <div class="grid-container">
            <div align="center">
                <h3> Existing admins table:</h3>
                <table className>
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
                <div>
                    username<br/>
                    <input placeholder="username"
                           value={username}
                           onChange={e => setUsername(e.target.value)}/>
                </div>
                <div style={{marginTop: 10}}>
                    password<br/>
                    <input placeholder="password"
                           value={password}
                           onChange={e => setPassword(e.target.value)}/>
                </div>
                <input type="button" value={'Add new admin!'} onClick={handleAddAdmin}/><br/>
            </div>
            <div align="center">
                <h3> My Polls:</h3>
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
                <input type="text" {...pollId} placeholder="poll id" />
                <input type="button" value={'view poll statistics'} onClick={handleViewPoll} /><br />
                <input type="button" value={'Add new poll!'} onClick={handleAddNewPoll}/><br/>
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