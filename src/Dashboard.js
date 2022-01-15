import React, {Fragment, useEffect, useState} from "react";
import {getUser, removeUserSession} from './Utils/Common';
import axios from 'axios';

import './Dashboard.css';

// const baseUrl = "http://localhost:5000"

function Dashboard(props) {
    const [adminsList, setAdminsList] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const fetchAdmins = async () => {
        try {
            const data = await axios.get('http://localhost:5000/admins');
            const {admins} = data.data
            setAdminsList(admins);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchAdmins();
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
        fetchAdmins();
    }

    return (
        <Fragment>
            <div>
                Welcome {user.name}!<br/><br/>
                <p align="right">
                    <input type="button" onClick={handleLogout} value="Logout" align="right"/>
                </p>
                <br/><br/>
            </div>
            {" "}
            <div align="center">
                <h3> Existing admins table:</h3>
                <table className="table mt-5 text-center">
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
        </Fragment>

    );
}
export default Dashboard;