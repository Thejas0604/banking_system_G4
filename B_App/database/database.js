import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME 
}).promise()

export async function checkCredentials(username, password) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE user_name = ? AND password_hash = ?', [username, password]
            )
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

