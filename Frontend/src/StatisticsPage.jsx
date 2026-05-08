import { useState } from 'react';
import axios from 'axios';

function StatisticsPage({ loggedInUsername }) {

    // states to handling loading and displaying statistics
    const [loadSavedData, setLoadSavedData] = useState(true);

    const [loading, setLoading] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);

    const [display, setDisplay] = useState(false);
    const [data, setData] = useState(null)

    // this function gets the user input and handles all statistic calculations, rendering, and errors
    function handleCalculateStatistics() {
        const numberSetInput = document.getElementById('numberSet').value
        setLoading(true);

        axios.post('http://127.0.0.1:5000/calculate_statistics', { username: loggedInUsername, numberSet: numberSetInput })
            .then(() => {
                axios.get('http://127.0.0.1:5000/calculate_statistics')
                    .then((response) => {
                        setData(response.data)
                        setLoading(false);
                        setErrorLoading(false);
                        setDisplay(true);
                    })
                    .catch(() => {
                        setLoading(false);
                        setErrorLoading(true);
                    });
            })
            .catch(() => {
                setLoading(false);
                setErrorLoading(true);
            });
    }

    // this function takes a given array and returns an array of jsx elements for each element in the array
    function displayArray(array) {
        let labels = [];
        for (let i = 0; i < array.length; i++) {
            labels.push(displayElement(array[i], i))
        }
        return labels;
    }

    // this function returns a jsx element for the given element
    function displayElement(element, index) {
        return <label key={index} id='numberLabel'>{element}</label>
    }

    // compoenent that displays the number set and statistics that come from user input
    const statisticsDisplay = (
        <div id='statisticsDisplay'>
            <h1 id='numberSetText'>Number Set</h1>
            <hr />
            <div id='numberSetLabels'>{data != null && displayArray(data['set'])}</div>
            <hr />
            <div id='numberSetStatisticsLabels'>
                <label id='numberLabel'>Min: {data != null && data['min']}</label>
                <label id='numberLabel'>Mean: {data != null && data['mean']}</label>
                <label id='numberLabel'>Median: {data != null && data['median']}</label>
                <label id='numberLabel'>Mode: {data != null && data['mode']}</label>
                <label id='numberLabel'>Max: {data != null && data['max']}</label>
            </div>
        </div>
    );

    // if saved data should be loaded request it
    if (loadSavedData) {
        axios.get('http://127.0.0.1:5000/calculate_statistics')
            .then((response) => {
                setData(response.data)
                setLoadSavedData(false);
                setDisplay(true);
            })
            .catch(() => {
                setLoadSavedData(false);
            });
    }

    // return the statistics page for rendering
    return (
        <div id='statisticsPage'>
            <h1 id='welcomeText'>Welcome to MyStats, {loggedInUsername}!</h1>
            <hr />
            <label htmlFor='numberSet'>Enter a set of comma-separated numbers. They can be integers, decimals, or a combiniation:</label> <br />
            <input type='text' id='numberSet'></input> <br />
            <button id='calculateStatisticsButton' onClick={handleCalculateStatistics}>Calculate Statistics</button>
            <p>{loading && 'Loading'}</p>
            <p id='errorText'>{errorLoading && 'ERROR: Failed to load number set. Make sure your set is correctly formatted (comma space separated).'}</p>
            {display && statisticsDisplay}
        </div>
    );
}

export default StatisticsPage;