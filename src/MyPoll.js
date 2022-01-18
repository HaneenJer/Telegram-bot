import React, { Component ,useEffect, useState}  from 'react';
import {getPollDescription, getPollId, getUser, removePoll, removeUserSession} from "./Utils/Common";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PieController,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Bar,Pie } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PieController,
    Title,
    Tooltip,
    Legend
  );
const options = {
    indexAxis: 'x',
    responsive: true,
    type: 'line',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },

    plugins: {
      legend: {
        position: 'right',
          fontColor: "blue"
      },
      title: {
        display: true,
        text: 'My Poll',
          fontColor: "blue"
      },
        xAxes: {
        display: true,
        text: 'My Poll',
      },
        yAxes: {
        display: true,
        text: 'My Poll',
      },
    },
  };

const MyPoll =(props) => {
    const [answersList, setAnswersList] = useState([]);
    const pollId = getPollId();
    const pollDescription = getPollDescription();

    const fetchAnswers = async () => {
        try {
            const data = await axios.get('http://localhost:5000/answers',{ params: { pollId: pollId}});
            const {answers} = data.data
            setAnswersList(answers);
            console.log('answersList');
            console.log(answersList);
        } catch (err) {
            console.error(err.message);
        }
    };

    // handle click event of logout button
    const handleBack = () => {
        removePoll();
        props.history.push('/dashboard');
    }
    const [data, setData] = useState({
        labels:['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
          {
            label: 'Answers',
            data:[],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(25, 90, 13, 0.5)',
          }
        ],
      });
    useEffect(()=> {
        const fetchAnswers= async()=> {
           const url = 'http://localhost:5000/answers'
           const labelSet = []
           const dataSet1 = [];
           const encodedValue = encodeURIComponent(pollId);
         await fetch(`http://localhost:5000/answers?pollId=${encodedValue}`).then((data)=> {
             console.log("flask data", data)
             const res = data.json();
             return res
         }).then((res) => {
             console.log("result", res['answers_list'])
            for (const val of res['answers_list']) {
                dataSet1.push(val.ans_num);
                console.log("val.ans_num", val.ans_num)
            }
            var dataSet1Unique = [...new Set(dataSet1)];
            const map = dataSet1.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
            console.log("dataSet1", dataSet1)
             console.info([...map.values()])
            setData({
                labels:dataSet1Unique,
                datasets: [
                  {
                    label: 'Poll Answers',
                    data:[...map.values()],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(99, 132, 0.5)',
                      fontColor: "white"
                  }
                ],
              })
            console.log("arrData", dataSet1Unique)
         }).catch(e => {
                console.log("error", e)
            })
        }

       fetchAnswers();
       //fetchData();

    },[])

    return(

        <div style={{width:'80%', height:'50%',align: "right" }}>
            {
                console.log("dataaaaaaaa", data)
            }
            Welcome to your poll {pollId} Page!
        <p align="right">
            <input type="button" onClick={handleBack} value="Back to my dashboard" align="right"/>
        </p>
        <br/><br/>
            <div>
                <Bar data={data} options={options} />
            </div>
         </div>)
}
export default MyPoll;