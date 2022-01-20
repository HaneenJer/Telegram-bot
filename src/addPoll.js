import React, {Fragment, useEffect, useState} from "react";
import {Container, TextField, makeStyles, IconButton, Button} from "@material-ui/core";
import axios from 'axios';

import './addPoll.css';
import {getUser} from "./Utils/Common";


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
    const [answersList, setAnswersList] = useState([{username: "", poll_id: "", answer: 0}]);
    const [updatedAnswersList, setUpdatedAnswersList] = useState([{username: "", poll_id: "",answer: 0}]);
    const user_id = useFormInput('');
    const poll_id = useFormInput('');
    const answer = useFormInput('');

    var originalAnswerList = [];

    const user = getUser();
        const fetchUsers = async () => {
        try {
            const data = await axios.get('http://localhost:5000/users');
            const {users} = data.data;
            for (let i = 0; i < users.length; i++) {
                users[i]["isChecked"] = false;
            }
            setUsersList(users);
            console.log('users');
            console.log(users)
        } catch (err) {
            console.error(err.message);
        }
    };

    const get_filtered_answers = async () => {
        try {
            var user_id_filter = user_id;
            var poll_id_filter = poll_id;
            var answer_filter = answer;
            console.log('params')
            console.log(user_id_filter.value)
            console.log(poll_id_filter.value)
            console.log(answer_filter.value)
            const data = await axios.get('http://localhost:5000/filteredAnswers', { params: { user_id: user_id_filter.value,
                    poll_id: poll_id_filter.value, ans_num: answer_filter.value } });
            const {answers} = data.data
            const {answersList} = data.data.answers_list
            setAnswersList(data.data.answers_list);
            console.log('data.data.answers_list: ');
            console.log(data.data.answers_list)
            console.log('answers: ');
            console.log(answers)
            console.log('answersList: ');
            console.log(answersList)
        } catch (err) {
            console.error(err.message);
        }
    };


    useEffect(() => {
        const fetchAnswers= async()=> {
           const url = 'http://localhost:5000/allAnswers'

         await fetch(`http://localhost:5000/allAnswers`).then((data)=> {
             console.log("flask data", data)
             const res = data.json();
             return res
         }).then((res) => {
             console.log("result", res['answers_list'])
            for (const val of res['answers_list']) {
                answersList.push(val);
                updatedAnswersList.push(val);
                console.log("val", val)
            }
            answersList.shift();
            updatedAnswersList.shift();
         }).catch(e => {
                console.log("error", e)
            })
        }
        fetchUsers();
        fetchAnswers();
    }, []);

    const handleChangeInput = (index, event) => {
        const values = [...inputFeilds];
        values[index]["description"] = event.target.value;
        setInputFeilds(values);
    }

    const handleResetTable = () => {
        setUsersList(originalAnswerList);
    }



    const handleFilter = () => {
        originalAnswerList = answersList;
        for (var i = 0; i < updatedAnswersList.length; i++) {
            if((user_id.value != '' && Object.values(updatedAnswersList[i])[2] != user_id.value)
            || (poll_id.value != '' && Object.values(updatedAnswersList[i])[1] != poll_id.value)
            || (answer.value != '' && Object.values(updatedAnswersList[i])[0] != answer.value)) {
                updatedAnswersList.splice(i, 1);
                i = i-1;
            }
        }
          setUpdatedAnswersList(updatedAnswersList);
        console.log(updatedAnswersList);
        get_filtered_answers();
    }

    const handlePollIdFilter = () => {
        for (var i = 0; i < answersList.length; i++) {
            if(Object.values(answersList[i])[1] != poll_id.value) {
                answersList.splice(i, 1);
                i = i-1;
            }
        }
        setUsersList(answersList);
    }

    const handleAnswerFilter = () => {
        console.log('answersList');
        console.log(answersList);
        for (var i = 0; i < answersList.length; i++) {
            if(Object.values(answersList[i])[0] != answer.value) {
                answersList.splice(i, 1);
                i = i-1;
            }
        }
        setUsersList(answersList);
        console.log('filtered answersList');
        console.log(answersList);
        setUsersList(answersList);
    }



    const handleAddOption = () => {
        setInputFeilds([...inputFeilds, {description: ''}]);
    }

    const handleRemoveOption = () => {
        const values = [...inputFeilds];
        const len = values.length;
        if (len > 2) {
            values.splice(len - 1, 1);
            setInputFeilds(values);
        }
    }


function checkAll() {
    var c = document.getElementById('users').getElementsByTagName('input');
    console.log(c)
    for (var i = 0; i < c.length; i++) {
        console.log(c[i].type)
        if (c[i].type == 'checkbox') {
            c[i].checked = true;
            handleCheck(i);
        }
    }
}

function resetChecked() {
    var c = document.getElementById('users').getElementsByTagName('input');
    for (var i = 0; i < c.length; i++) {
        if (c[i].type == 'checkbox') {
            c[i].checked = false;
            usersList[i]["isChecked"] = false;
        }
    }
}

function checkSorted() {
    resetChecked();
    var c = document.getElementById('users').getElementsByTagName('input');
    console.log(c)
    console.log('answersList')
    console.log(answersList)
    console.log('usersList')
    console.log(usersList)
    for (var i = 0; i < c.length; i++) {
        for (var j = 0; j < answersList.length; j++) {
            if(answersList[j].user_id === usersList[i].chat_id){
                c[i].checked = true;
                handleCheck(i);
            }
        }
    }
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
        const poll = {pollDesc, name, inputFeilds, usersList}
        await axios.post('http://localhost:5000/polls', poll)
    }

    const handleCheck = (index) =>{
    usersList[index]["isChecked"] = true;
    }

     {/*TODO: check how to add icons */}
    return (

        <Container>

            <div className="grid-container">
                <div>
                    <h2 >Add Poll </h2>
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
                                {/*<AddCircle/>*/}
                            </IconButton>
                            <IconButton onClick={handleRemoveOption}>
                                {/*<RemoveCircle/>*/}
                            </IconButton>
                            <br/>
                            <Button className={classes.button} variant="contained" color={"primary"} type="submit"
                                // endIcon={<Send/>}
                                    onClick={handleSubmit}>
                                Add Poll
                            </Button>
                        </div>
                    </form>
                </div>
                <div id='users'>
                    <h2>Select target audience</h2>
                    <br/><br/>
                    <table>
                        <thead>
                        <tr>
                            <th>user_id</th>
                            <th>username</th>
                            <th>select</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersList.map((user, index) => (
                            <tr key={index}>
                                <td>{user.chat_id}</td>
                                <td>{user.name}</td>
                                <td><input type="checkbox" onChange={()=>handleCheck(index)}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Button id='myButton' className={classes.button} variant="contained" color={"primary"} type="submit"
                                // endIcon={<Send/>}
                                    onClick={checkAll}>
                                check all
                    </Button>
                    <Button id='myButton' className={classes.button} variant="contained" color={"primary"} type="submit"
                                // endIcon={<Send/>}
                                    onClick={checkSorted}>
                                check sorted
                    </Button>

                </div>
                <div>
                    <h2>Filter target audience</h2>
                    <input type="text" {...user_id} placeholder="user id" />
                    <input type="text" {...poll_id} placeholder="poll id" />
                    <input type="text" {...answer} placeholder="answer" />
                    <br/><br/>
                    <Button className={classes.button} variant="contained" color={"primary"} type="submit"
                                // endIcon={<Send/>}
                                    onClick={handleFilter}>
                                filter!
                    </Button>
                    <br/><br/>
                    <table>
                        <thead>
                        <tr>
                            <th>user_id</th>
                            <th>poll_id</th>
                            <th>answer</th>
                        </tr>
                        </thead>
                        <tbody>
                        {answersList.map((answer, index) => (
                            <tr key={index}>
                                <td>{answer.user_id}</td>
                                <td>{answer.poll_id}</td>
                                <td>{answer.ans_num}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </Container>
    )
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

export default AddPoll;