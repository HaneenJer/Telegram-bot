import React from 'react';
import {getPollId, getUser, removePoll, removeUserSession} from "./Utils/Common";

function MyPoll(props) {
    const pollId = getPollId();

    // handle click event of logout button
    const handleBack = () => {
        removePoll();
        props.history.push('/dashboard');
    }

  return (
    <div>
      Welcome to your poll {pollId} Page!
        <p align="right">
            <input type="button" onClick={handleBack} value="Back to my dashboard" align="right"/>
        </p>
        <br/><br/>
    </div>
  );
}

export default MyPoll;
