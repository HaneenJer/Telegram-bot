import React, {useEffect, useState} from "react";
import {Container, TextField, makeStyles, IconButton, Button} from "@material-ui/core";
import {RemoveCircle, AddCircle, Send} from "@material-ui/icons";
import './addPoll.css';
import axios from "axios";
import {getUser} from "./Utils/Common";
// import {TablePagination} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        }
    },
    button:
        {
            margin: theme.spacing(1),
        }
}))


function AddPoll(props) {
    const classes = useStyles();
    const [pollDesc, setPollDesc] = useState("")
    const [inputFeilds, setInputFeilds] = useState([{description: ''}, {description: ''},])
    const [usersList, setUsersList] = useState([{username: "", chat_id: "", isChecked: false}]);

    const user = getUser();

    const fetchUsers = async () => {
        try {
            const data = await axios.get('http://localhost:5000/users');
            const {users} = data.data;
            for (let i = 0; i < users.length; i++) {
                users[i]["isChecked"] = false;
            }
            setUsersList(users);
        } catch (err) {
            console.error(err.message);
        }
    };
    console.log("this is the users list:", usersList);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangeInput = (index, event) => {
        const values = [...inputFeilds];
        values[index]["description"] = event.target.value;
        setInputFeilds(values);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("input fields: ", inputFeilds);
        console.log("description: ", pollDesc);
        const values = [...inputFeilds];
        for (let i = 0; i < values.length; i++) {
            if (values[i]["description"] === '') {
                alert("You can't submit empty feilds, please fill the relevant options ");
                return;
            }
        }
        const name = user["name"];
        const poll = {pollDesc,name, inputFeilds, usersList}
        await axios.post('http://localhost:5000/polls', poll)

    }

    const handleAddOption = () => {
        setInputFeilds([...inputFeilds, {description: ''}]);
    }

    const handleRemoveOption = () => {
        // const handleRemoveOption = (index) => {
        const values = [...inputFeilds];
        const len = values.length;
        if (len > 1) {
            values.splice(len - 1, 1);
            setInputFeilds(values);
        }
    }

    const handleCheck = (index) =>{
    usersList[index]["isChecked"] = true;
    console.log("this is teh users list data after updating: ", usersList);
    }


    return (
        <Container>
            <div className="grid-container">
                <div>
                    <h2>Add Poll</h2>
                    <br/><br/>
                    <form className={classes.root}>
                        <div>
                            <h4>Please enter the poll description</h4>
                            <TextField name="description" label={"description"} value={pollDesc.description}
                                       onChange={e => setPollDesc(e.target.value)}/>
                            <h4>Poll options</h4>
                            {inputFeilds.map((inputFeild, index) => (
                                <div key={index}>
                                    <TextField name="option" label={"option"} value={inputFeilds.description}
                                               onChange={event => handleChangeInput(index, event)}/>
                                </div>
                            ))}
                            <IconButton onClick={handleAddOption}>
                                <AddCircle/>
                            </IconButton>
                            <IconButton onClick={handleRemoveOption}>
                                <RemoveCircle/>
                            </IconButton>
                            <br/>
                            <Button className={classes.button} variant="contained" color={"primary"} type="submit"
                                    endIcon={<Send/>}
                                    onClick={handleSubmit}>
                                Add Poll
                            </Button>
                        </div>
                    </form>
                </div>
                <div>
                    <h2>Select target audience</h2>
                    <br/><br/>
                    <table>
                        {/*<TablePagination count={10} page={2} onPageChange={2} rowsPerPage={5}/>*/}
                        <thead>
                        <tr>
                            <th>username</th>
                            <th>select</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersList.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td><input type="checkbox" onChange={()=>handleCheck(index)}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    )
}

export default AddPoll;