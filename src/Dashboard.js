import React, { Fragment, useEffect, useState } from "react";
import { getUser, removeUserSession } from './Utils/Common';
import axios from 'axios';

import './Dashboard.css';

const baseUrl = "http://localhost:5000"

function Dashboard(props){
  const [adminsList, setAdminsList] = useState([]);


  const fetchAdmins = async () => {
    try {
      const data = await axios.get('http://localhost:5000/admins')
      console.error(data);
      const {admins} = data.data
      setAdminsList(admins);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  console.log(adminsList)


  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }

  return (

    <Fragment>
      <div>
      Welcome {user.name}!<br /><br />
        <p align="right">
            <input type="button" onClick={handleLogout} value="Logout" align="right" />
        </p>
        <br /><br />
    </div>
      {" "}
      <div align="center">
      <h3> Existing admins table:</h3>
      <table class="table mt-5 text-center">
        <thead>
          <tr>
            <th>username</th>
          </tr>
        </thead>
        <tbody>
          {adminsList.map(admin => (
            <tr key={admin.username}>
              <td>{admin.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Fragment>

  );
};

export default Dashboard;