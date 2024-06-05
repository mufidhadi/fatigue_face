const express = require('express')
const cors = require('cors')
const { MYSQLcon } = require('./MYSQLcon')
const bodyParser = require('body-parser')

MYSQLcon.connect(function (err) {
    if (err) throw err
    console.log("MYSQL Connected!")
})

const app = express()

const port = 3300

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('Hello World!<br>' + JSON.stringify(req.query))
})

app.get('/employee', (req, res) => {
    const query = "SELECT * FROM employee"

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        res.json(result)
    })
})

app.get('/employee/:id', (req, res) => {
    const query = "SELECT * FROM employee WHERE id=" + req.params.id

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        if (result.length == 0) res.sendStatus(404)
        res.json(result[0])
    })
})

app.post('/employee', (req, res) => {
    const name = req.body.name
    const face = req.body.face
    
    const query = "INSERT INTO employee (name, face) VALUES ('" + name + "', '" + face + "')"

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        res.json({name: name, face: face, id: result.insertId})
    })
})

app.put('/employee/:id', (req, res) => {
    const name = req.body.name
    const face = req.body.face

    const query = "UPDATE employee SET name='" + name + "', face='" + face + "' WHERE id=" + req.params.id

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        res.json({name: name, face: face, id: req.params.id})
    })
})

app.delete('/employee/:id', (req, res) => {

    const query = "DELETE FROM employee WHERE id=" + req.params.id

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        res.sendStatus(200)
    })
})

app.get('/driving_log', (req, res) => {
    const query = "SELECT * FROM driving_log"

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        res.json(result)
    })
})

app.get('/driving_log/employee/:id', (req, res) => {
    const query = "SELECT * FROM driving_log WHERE employee_id=" + req.params.id

    MYSQLcon.query(query, function (err, result) {
        if (err) res.sendStatus(500)
        res.json(result)
    })
})

app.listen(port, () => {
    console.log(`BE app listening on port ${port}`)
})