import React, { Component ,useEffect, useState}  from 'react';
import {getPollId, getUser, removePoll, removeUserSession} from "./Utils/Common";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
const options = {
    indexAxis: 'x',
    type: 'line',

    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'My Poll',
      },
    },
  };

const MyPoll =(props) => {
        const [answersList, setAnswersList] = useState([]);
    const pollId = getPollId();

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
       const fetchData= async()=> {
           const url = 'https://jsonplaceholder.typicode.com/comments'
           const labelSet = []
           const dataSet1 = [];
         await fetch(url).then((data)=> {
             console.log("Api data", data)
             const res = data.json();
             return res
         }).then((res) => {
             console.log("ressss", res)
            for (const val of res) {
                dataSet1.push(val.id);
                // labelSet.push(val.name)
            }
            setData({
                labels:['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [
                  {
                    label: 'Dataset ID',
                    data:dataSet1,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(99, 132, 0.5)',
                  }
                ],
              })
            console.log("arrData", dataSet1)
         }).catch(e => {
                console.log("error", e)
            })
        }

    //     const fetchAnswers = async () => {
    //     try {
    //         const data = await axios.get('http://localhost:5000/answers',{ params: { pollId: pollId}});
    //         console.log('data.data');
    //         console.log(data.data);
    //         const {answers} = data.data
    //          console.log('answers');
    //          console.log(answers);
    //         setAnswersList(answers);
    //         console.log('answersList');
    //         console.log(answersList);
    //     } catch (err) {
    //         console.error(err.message);
    //     }
    // }

        const fetchAnswers= async()=> {
           const url = 'http://localhost:5000/answers'
           const labelSet = []
           const dataSet1 = [];
         await fetch(url).then((data)=> {
             console.log("flask data", data)
             const res = data.json();
             return res
         }).then((res) => {
             console.log("result", res['answers_list'])
            for (const val of res['answers_list']) {
                dataSet1.push(val.ans_num);
                console.log("val.ans_num", val.ans_num)
            }
            console.log("dataSet1", dataSet1)
            setData({
                labels:['1','2', '3'],
                datasets: [
                  {
                    label: 'Poll Answers',
                    data:dataSet1,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(99, 132, 0.5)',
                  }
                ],
              })
            console.log("arrData", dataSet1)
         }).catch(e => {
                console.log("error", e)
            })
        }

       fetchAnswers();
       fetchData();

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