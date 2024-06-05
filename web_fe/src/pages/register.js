import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export function RegisterPage({ isEdit = false }) {
    const [driver, setDriver] = useState({})
    const navigate = useNavigate()

    const { employeeId } = useParams()

    function formHandler(e) {
        e.preventDefault()
        console.log(driver)
        let url = 'http://localhost:3300/employee'
        let method = 'POST'

        if (isEdit) {
            url = 'http://localhost:3300/employee/' + employeeId
            method = 'PUT'
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driver)
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    navigate('/')
                } else {
                    alert('Failed to add driver')
                }
            })
    }

    function changeHandler(e) {
        setDriver({
            ...driver,
            [e.target.name]: e.target.value
        })
    }

    function fileHandler(e) {
        fileToBase64(e.target.files[0]).then(result => {
            setDriver({
                ...driver,
                [e.target.name]: result
            })
        })
    }

    async function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

    useEffect(() => {
        if (isEdit) {
            async function getDriver() {
                const url = 'http://localhost:3300/employee/' + employeeId
                const res = await fetch(url)
                const data = await res.json()
                console.log(data)
                setDriver(data)
            }
            getDriver()
        }
    }, [])

    return (
        <>
            <div className="container">
                <div className="row align-items-center my-3">
                    <div className="col-auto">
                        <h3>Add New Driver</h3>
                    </div>
                    <div className="col align-self-center">
                        <hr />
                    </div>
                    <div className="col-auto">
                        <Link to="/" className="btn btn-dark float-end">Back</Link>
                    </div>
                </div>

                <div className="row my-5">
                    <div className="col">
                        <form action="">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name="name" onChange={changeHandler} defaultValue={driver.name} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="face" className="form-label">Face Photo</label>
                                <input type="file" className="form-control" id="face" name="face" onChange={fileHandler} />
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={formHandler}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}