import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { LineChart } from "../components/chart"

export function ChartPage({ }) {
    const { employeeId } = useParams()

    const [driver, setDriver] = useState({})
    const [driverSummary, setDriverSummary] = useState({})
    const [driverLogs, setDriverLogs] = useState([])

    useEffect(() => {
        async function getDriver() {
            const url = 'http://localhost:3300/employee/' + employeeId
            const res = await fetch(url)
            const data = await res.json()
            setDriver(data)
        }
        getDriver()
    },[])

    useEffect(() => {
        async function getDriverSummary() {
            const url = 'http://localhost:3300/driving_log/employee/'+employeeId+'/summary/'
            const res = await fetch(url)
            const data = await res.json()
            setDriverSummary(data)
        }
        async function getDriverLogs() {
            const url = 'http://localhost:3300/driving_log/employee/'+employeeId
            const res = await fetch(url)
            const data = await res.json()
            let logs = []
            for (let i = 0; i < data.length; i++) {
                const {id, employee_id, ...row} = data[i]
                logs.push(row)
            }
            setDriverLogs(logs)
        }
        getDriverLogs()
        getDriverSummary()
    },[driver])
    return (
        <div className="container">
            <div className="row my-3">
                <div className="col-2">
                    <img src={driver.face} alt={driver.name} className="img-fluid rounded" />
                </div>
                <div className="col-auto align-self-center">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h1>{driver.name}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="card-title">Total Driving Time</div>
                                        <h3>{driverSummary.total} <small>minutes</small></h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="card-title">Avg. Eye Close Count</div>
                                        <h3>{Math.round(driverSummary.avg_eye_closed_count)} <small>times</small></h3>
                                        <p>(per-minute driving)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="card-title">Avg. Eye Close Duration</div>
                                        <h3>{Math.round(driverSummary.avg_eye_closed_duration * 100) / 100} <small>seconds</small></h3>
                                        <p>(per-minute driving)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <Link to="/" className="btn btn-dark float-end">Back</Link>
                </div>
            </div>
            <div className="row align-items-center my-3">
                <div className="col-auto">
                    <h3>Driver History</h3>
                </div>
                <div className="col align-self-center">
                    <hr />
                </div>
            </div>
            <div className="row my-5">
                <div className="col-6">
                    <h5>Eye Close Count Per-Minute Driving</h5>
                    <LineChart data={driverLogs} data_label="time" data_value={"eye_closed_count"} />
                </div>
                <div className="col-6">
                    <h5>Eye Close Duration Per-Minute Driving (seconds)</h5>
                    <LineChart data={driverLogs} data_label="time" data_value={"eye_closed_duration"} />
                </div>
            </div>
        </div>
    )
}