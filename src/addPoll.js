import React, {useState} from "react";
import {Container, TextField, makeStyles, IconButton, Button} from "@material-ui/core";
import {RemoveCircle, AddCircle, Send} from "@material-ui/icons";

import './addPoll.css';
import axios from "axios";

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

    const handleChangeInput = (index, event) => {
        const values = [...inputFeilds];
        values[index]["description"] = event.target.value;
        setInputFeilds(values);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("input fields: ", inputFeilds);
        console.log("description: ", pollDesc);
        const poll = {pollDesc}
        await axios.post('http://localhost:5000/polls', poll)
    }

    const handleAddOption = () => {
        setInputFeilds([...inputFeilds, {description: ''}]);
    }

    const handleRemoveOption = (index) => {
        const values = [...inputFeilds];
        if (values.length > 1) {
            values.splice(index, 1);
            setInputFeilds(values);
        }
    }

    return (
        <Container>
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
                            <IconButton onClick={handleAddOption}>
                                <AddCircle/>
                            </IconButton>
                            <IconButton onClick={() => handleRemoveOption(index)}>
                                <RemoveCircle/>
                            </IconButton>
                        </div>
                    ))}
                    <Button className={classes.button} variant="contained" color={"primary"} type="submit"
                            endIcon={<Send/>}
                            onClick={handleSubmit}>
                        Add Poll
                    </Button>
                </div>
            </form>
        </Container>
    )
}

export default AddPoll;