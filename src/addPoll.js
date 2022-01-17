import React, {Fragment, useState} from "react";

import './addPoll.css';

function AddPoll(props) {
    const [pollDesc, setPollDesc] = useState("")
    const [pollOptions, addPollOption] = useState([])

    return (
        <Fragment>
            <div>
                Add Poll<br/><br/>
                <br/><br/>
            </div>
            <div>
                please enter the poll description<br/>
                <input placeholder="description"
                       value={pollDesc}
                       onChange={e => setPollDesc(e.target.value)}/>
                <br/>
                add poll options<br/>
                <input placeholder="add first option"
                       value={pollOptions}
                       onChange={e => addPollOption(e.target.value)}/>


            </div>
        </Fragment>
    )
}

export default AddPoll;