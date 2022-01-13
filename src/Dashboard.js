import React, { Fragment, useEffect, useState } from "react";
import { getUser, removeUserSession } from './Utils/Common';

import EditTodo from "./EditTodo";
import './Dashboard.css';

function Dashboard(props){
  const [todos, setTodos] = useState([]);

  //delete todo function

  const deleteTodo = async id => {
    try {
      const deleteTodo = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE"
      });

      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      const jsonData = await response.json();

      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  console.log(todos);

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
          {<tr>
            <td>admin</td>
          </tr> }
          {todos.map(todo => (
            <tr key={todo.todo_id}>
              <td>{todo.description}</td>
              <td>
                <EditTodo todo={todo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Fragment>

  );
};

export default Dashboard;