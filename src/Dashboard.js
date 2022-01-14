import React, { Fragment, useEffect, useState } from "react";
import { getUser, removeUserSession } from './Utils/Common';
import axios from 'axios';

import './Dashboard.css';

const baseUrl = "http://localhost:5000"

function Dashboard(props){
  const [adminsList, setAdminsList] = useState([]);
  const username = useFormInput('');
  const password = useFormInput('');

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

  // handle click event of logout button
  const handleAddAdmin = () => {
    axios.post('http://localhost:5000/admins', { username: username.value, password: password.value })
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
        <div>
        username<br />
        <input type="text"  autoComplete="new-admin" />
      </div>
      <div style={{ marginTop: 10 }}>
        password<br />
        <input type="password"  autoComplete="new-password" />
      </div>
      <input type="button" value={'Add new admin!'} onClick={handleAddAdmin} /><br />
      </div>
    </Fragment>

  );
};

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