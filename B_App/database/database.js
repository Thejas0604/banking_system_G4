import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })
  .promise();

/////----------Login----------////////////////
//Credentials check
export async function checkCredentials(username, password) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE user_id = ? AND password_hash = ?",
      [username, password]
    );
    if (rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
///////////////////////////////////////////////

//Get user name
export async function getUserName(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT name FROM customer WHERE customer_id = ?",
      [uid]
    );
    return rows[0].name;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/////----------Dashboard----------////////////////
//Get Savings Account Number
export async function getSavingsAccountNo(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT account_no FROM savings_account WHERE customer_id = ?",
      [uid]
    );
    return rows[0].account_no;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//Get Savings Account Balance
export async function getSavingsAccountBalance(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT balance FROM savings_account WHERE customer_id = ?",
      [uid]
    );
    return rows[0].balance;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//Get Savings Account Withdrawals Left
export async function getSavingsAccountWithdrawalsLeft(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT remaining_withdrawals FROM savings_account WHERE customer_id = ?",
      [uid]
    );
    return rows[0].remaining_withdrawals;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Validate savings account
export async function validateSavingsAccount(account_no) {
  {
    // Execute the stored procedure and retrieve the result
    const [rows] = await pool.execute(
      "CALL ValidateSavingsAccount(?, @p_is_valid)",
      [account_no]
    );
    const result = await pool.query("SELECT @p_is_valid as is_valid");
    const is_valid = result[0][0].is_valid;

    // Release the connection pool

    return is_valid;
  }
}

// validate transfer amount
export async function validateTransferAmount(amount, account_no) {
  try {
    const [results] = await pool.query(
      "SELECT balance FROM savings_account WHERE account_no = ?",
      [account_no]
    );
    if (results.length > 0 && results[0].balance >= amount) {
      // Balance is sufficient; proceed with the transfer
      return true;
    } else {
      // Insufficient balance; show an error message
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // You can handle the error further up the call stack
  }
}

//Get Current Account Number - Not finished
export async function getCurrentAccountNo(uid) {
    try {
        const [rows] = await pool.query(
          "SELECT account_no FROM current_account WHERE customer_id = ?",
          [uid]
        );
        return rows[0].account_no;
      } catch (err) {
        console.log(err);
        return false;
      }
}

//Get Current Account Balance - Not finished
export async function getCurrentAccountBalance(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT balance FROM current_account WHERE customer_id = ?",
      [uid] //insert query here
    );
    return rows[0].balance;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//Get fd info
export async function getFDInfo(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM fixed_deposit WHERE customer_id = ?",
      [uid]
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
}
///////////////////////////////////////////////
