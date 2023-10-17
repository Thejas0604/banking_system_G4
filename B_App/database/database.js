import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root' ,
    password: process.env.DB_PASS || 'Iyadhsql6702' ,
    database: process.env.DB_NAME || 'login_banking'
}).promise()

export async function checkCredentials(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password_ = ?', [username, password])
        if (rows.length > 0) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
        return false
    }
};
