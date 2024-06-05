import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export function Home({ }) {
    const [drivers, setDrivers] = useState([])

    async function getDrivers() {
        const url = 'http://localhost:3300/employee'

        const res = await fetch(url)

        const data = await res.json()

        setDrivers(data)
    }

    useEffect(() => {
        getDrivers()
    }, [])

    function deleteDriver(driverId) {
        // ask user if they want to delete
        if (window.confirm('Are you sure you want to delete this driver?')) {
            const url = 'http://localhost:3300/employee/' + driverId
            fetch(url, { method: 'DELETE' }).then(() => getDrivers()).catch(err => console.log(err))
        }
    }

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
                    <div className="col-auto">
                        <Link to="/register" className="btn btn-dark">Add Driver</Link>
                    </div>
                </div>

                <div className="row my-3">
                    {drivers.map((driver) => (
                        <div className="col-md-2 col-sm-3 mb-4">
                            <div className="card h-100">
                                <img src={driver.face} alt={driver.name} className="card-img-top" />
                                <div className="card-body">
                                    <div className="h5 card-title">{driver.name}</div>
                                    <div className="d-grid gap-2">
                                        <Link to={'/chart/' + driver.id} className="btn btn-dark">Data 📊</Link>
                                        <Link to={'/register/' + driver.id} className="btn btn-outline-dark">Edit ✏️</Link>
                                        <button className="btn btn-outline-danger" onClick={() => deleteDriver(driver.id)} >Delete 🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}