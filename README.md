# Facial Recognition and Fatigue Analysis
<img src="./running.gif" width="100%" />

## Pre-request:
- MySQL >= 5.6
- nodejs >= 18.14
- python >= 3.10

## How To Setup:
### 1. Project setup
- pull this repo
    ```bash
    git clone https://github.com/mufidhadi/fatigue_face.git
    ```
- open project directory
    ```bash
    cd fatigue_face
    ```

### 2. Database setup
- open database directory
    ```bash
    cd ./db
    ```
- import sql file
    ```bash
    mysql -u your_mysql_username -p < export2.sql
    ```
    or use this one, if your mysql has no password
    ```bash
    mysql -u your_mysql_username < export2.sql
    ```
- back to parent direcctory
    ```bash
    cd ..
    ```
### 3. Dashboard Backend setup
- open backend server directory
    ```bash
    cd ./web_be
    ```
- install the project package
    ```bash
    npm install
    ```
- change mysql setting in the `./web_be/MYSQLcon.js`
    from...
    ```js
    const mysql = require('mysql');

    const MYSQLcon = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "face_fatigue"
    });
    exports.MYSQLcon = MYSQLcon;
    ```
    ...to...
    ```js
    const mysql = require('mysql');

    const MYSQLcon = mysql.createConnection({
        host: "localhost",
        user: "your_mysql_userrname",
        password: "your_mysql_password",
        database: "face_fatigue"
    });
    exports.MYSQLcon = MYSQLcon;
    ```
- start backend server
    ```bash
    node start .
    ```
    the backend server will use port 3300
### 4. Dashboard Frontend setup
- you will need to open new terminal for this one (bc. the last terminal has been used for backend service)
- open frontend directory
    ```bash
    cd fatigue_face/web_fe/
    ```
- install the project packages
    ```bash
    npm install
    ```
- start the frontend service
    ```bash
    npm start
    ```
### 5. Main CV setup
- you will need to open new terminal for this one too
- open `ai` directory
    ```bash
    cd fatigue_face/ai
    ```
- create new virtual environment
    ```bash
    python -m venv venv
    ```
    if you're using windows, use this command to activate the virtual environment
    ```bash
    .\venv\Scripts\activate
    ```
    or use this command if you're using linux or mac
    ```bash
    source venv/bin/activate
    ```
- install all required packages
    ```bash
    pip install -r requirements.txt
    ```
- change mysql setting in the `./ai/mysql_default.py`
    from...
    ```python
    mysql_config = {
        'host':'localhost',
        'user':'root',
        'password':'',
        'database':'face_fatigue',
    }
    ```
    ...to...
    ```python
    mysql_config = {
        'host':'localhost',
        'user':'your_mysql_username',
        'password':'your_mysql_password',
        'database':'face_fatigue',
    }
    ```
- run the project with this command
    ```bash
    python main.py
    ```
