import React, {useEffect, useState} from 'react';
import {getPollId, removePoll} from "./Utils/Common";
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

import {Bar} from 'react-chartjs-2';

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

const MyPoll = (props) => {
    const pollId = getPollId();

    const getPollDesc = async () => {
        if (pollId == null) {
            return;
        }
        const data = await axios.get('http://localhost:5000/pollDesc', { params: { poll_id: pollId } });
        options['plugins']['title']['text'] = data.data;
    }

    // handle click event of logout button
    const handleBack = () => {
        removePoll();
        props.history.push('/dashboard');
    }
    const [data, setData] = useState({
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
            {
                label: 'Answers',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(25, 90, 13, 0.5)',
            }
        ],
    });
    useEffect(() => {
        const fetchAnswers = async () => {
            const dataSet1 = [];
            const encodedValue = encodeURIComponent(pollId);
            if (pollId == null) {
                return;
            }
            await fetch(`http://localhost:5000/answers?pollId=${encodedValue}`).then((data) => {
                const res = data.json();
                return res
            }).then((res) => {
                for (const val of res['answers_list']) {
                    dataSet1.push(val.ans_num);
                }
                var dataSet1Unique = [...new Set(dataSet1)];
                const map = dataSet1.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
                setData({
                    labels: dataSet1Unique,
                    datasets: [
                        {
                            label: 'Poll Answers',
                            data: [...map.values()],
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(99, 132, 0.5)',
                            fontColor: "white"
                        }
                    ],
                })
            }).catch(e => {
                console.log("error", e)
            })
        }
        getPollDesc();
        fetchAnswers();
        //fetchData();

    }, [])

    return (

        <div style={{width: '80%', height: '50%', align: "right"}}>
            Welcome to your poll {pollId} Page!
            <p align="right">
                <input type="button" onClick={handleBack} value="Back to my dashboard" align="right"/>
            </p>
            <br/><br/>
            <div className='my_poll'>
                <Bar data={data} options={options}/>
            </div>
        </div>)
}
export default MyPoll;