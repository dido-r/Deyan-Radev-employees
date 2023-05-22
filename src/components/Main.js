import { useState } from 'react';
import Papa from 'papaparse'
import styles from './Main.module.css';
import { Result } from './Result';

export function Main() {

    const [result, setResult] = useState([]);
    const [error, setEror] = useState(false);

    const importFile = (e) => {

        let file = e.target.files[0];

        if (file === undefined) {

            return;
        }

        setEror(file.type !== 'text/csv' ? true : false);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                let list = results.data
                findLongest(list);
            },
        });
    }

    const findLongest = (list) => {

        setResult([]);
        let projects = [...new Set(list.map(x => x.ProjectId))];

        for (let project of projects) {

            let arr = list.filter(x => x.ProjectId === project)
            compare(arr);
        }
    }

    const compare = (arr) => {

        if (arr.length < 2) {

            return;
        }

        let startDate = null;
        let endDate = null;
        let days = 0;

        let bestPair = {

            id1: 0,
            id2: 0,
            days: 0
        }

        for (let i = 0; i < arr.length; i++) {

            for (let j = i + 1; j < arr.length; j++) {

                let emp1Start = new Date(arr[i].DateFrom);
                let emp2Start = new Date(arr[j].DateFrom);
                startDate = emp1Start.getTime() > emp2Start.getTime() ? emp1Start : emp2Start;

                let emp1Stop = arr[i].DateTo === "NULL" ? new Date() : new Date(arr[i].DateTo);
                let emp2Stop = arr[j].DateTo === "NULL" ? new Date() : new Date(arr[j].DateTo);
                endDate = emp1Stop.getTime() < emp2Stop.getTime() ? emp1Stop : emp2Stop;

                if (startDate.getTime() < endDate.getTime()) {

                    let workDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

                    if (days < workDays) {

                        days = workDays;
                        bestPair.days = workDays;
                        bestPair.id1 = arr[i].EmpId;
                        bestPair.id2 = arr[j].EmpId;
                    }
                }
            }
        }

        if (bestPair.days !== 0) {

            setResult(x => [...x, {
                employeeId1: bestPair.id1,
                employeeId2: bestPair.id2,
                currentProjectID: arr[0].ProjectId,
                workDays: bestPair.days
            }]);
        }
    }

    return (
        <div className={styles['container']}>
            <h2>Longest period</h2>
            <label htmlFor="upload" className={styles['btn-upload']}>Upload file</label>
            <input id='upload' type='file' accept='.csv' onChange={(e) => importFile(e)} /><br></br>
            {error ? <p className={styles['error']}>Please upload a .csv file</p> : null}
            {result.length !== 0 ? <Result result={result} /> : null}
        </div>
    )
}