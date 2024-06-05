import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export function Home({ }) {
    const [drivers,setDrivers] = useState([])

    useEffect(() => {
        async function getDrivers() {
            const url = 'http://localhost:3300/employee'

            const res = await fetch(url)

            const data = await res.json()

            setDrivers(data)
        }

        getDrivers()
    }, [])

    return (
        <>
            <div className="container">
                <div className="row align-items-center my-3">
                    <div className="col-auto">
                        <h3>Driver List</h3>
                    </div>
                    <div className="col align-self-center">
                        <hr />
                    </div>
                </div>

                <div className="row my-3">
                    {drivers.map((driver) => (
                        <div className="col-md-2 col-sm-3">
                            <div className="card h-100">
                                <img src={driver.face} alt={driver.name} className="card-img-top" />
                                <div className="card-body">
                                    <div className="h5 card-title">{driver.name}</div>
                                    <Link to={'/chart/'+driver.id} className="btn btn-dark">Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}