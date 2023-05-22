import styles from './Result.module.css'

export function Result({ result }) {

    return (
        <table className={styles['table']}>
            <thead>
                <tr>
                    <th>Employee ID #1</th>
                    <th>Employee ID #2</th>
                    <th>Project ID</th>
                    <th>Days worked</th>
                </tr>
            </thead>
            <tbody>
                {result.map(x =>

                    <tr key={x.employeeId1 + x.employeeId2 + x.currentProjectID + x.workDays}>
                        <td>{x.employeeId1}</td>
                        <td>{x.employeeId2}</td>
                        <td>{x.currentProjectID}</td>
                        <td>{x.workDays}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}