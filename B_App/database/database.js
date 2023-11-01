import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  }).promise();

/////----------Login----------////////////////
//Credentials check
export async function checkCredentials(username, password) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE user_name = ? AND password_hash = ?",
      [username, password]
    );
    if (rows.length > 0) {
      return rows;
      // return true;
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
export async function getCDetails(cus_id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customer WHERE customer_id = ?",
      [cus_id]
    );
    return rows[0]
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function getCusId(un) {
  try {
    const [rows] = await pool.query(
      // "CALL getCusID(?, @p_customer_id)",  
      // [un]
      "select user_id from user where user_name = ?",
      [un]
    );
    return rows[0].user_id;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function getEDetails(emp_id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM employee WHERE employee_id = ?",
      [emp_id]
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
}

/////----------Dashboard----------////////////////




//Get Savings Account Withdrawals Left
export async function getSavingsDetails(uid) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM savingsdetails WHERE customer_id = ?",
      [uid]
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
}
//Get Savings Account Withdrawals Left
export async function getSavTypeDetails(type) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM savings_account_type WHERE account_type = ?",
      [type]
    );
    return rows[0];
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
export async function getCurrentDetails(uid) {
    try {
        const [rows] = await pool.query(
          "SELECT * FROM currentdetails WHERE customer_id = ?",
          [uid]
        );
        return rows[0];
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




// export async function createCurrent1(uid, BId, startDate, startAmount) {
//   try {
//     const [rows] = await pool.query(
//       "INSERT INTO account (customer_id, account_type, branch_id, start_date, starting_amount) VALUES (?, ?, ?, ?, ?)",
//       [uid, "current", BId, startDate, startAmount]
//     );
//     const [accountRows] = await pool.query(
//       "SELECT account_no FROM account WHERE customer_id = ? AND account_type = ?",
//       [uid, "current"]
//     );
//     const accountNo = accountRows[0].account_no;
//     console.log(accountNo);
//     await pool.query(
//       "INSERT INTO current_account ( balance) VALUES (?)", ////////////////////////////////////not good code
//       [startAmount]
//     );
//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// }

// export async function createSavings1(uid, BId, startDate, startAmount, account_type) {
//   try {
//     const [rows] = await pool.query(
//       "INSERT INTO account (customer_id, account_type, branch_id, start_date, starting_amount) VALUES (?, ?, ?, ?, ?)",
//       [uid, "current", BId, startDate, startAmount]
//     );
//     const [accountRows] = await pool.query(
//       "SELECT account_no FROM account WHERE customer_id = ? AND account_type = ?",
//       [uid, "savings"]
//     );
//     console.log(accountRows[0]);
//     const accountNo = accountRows[0].account_no;
//     await pool.query(
//       "INSERT INTO savings_account (account_type, balance, remaining_withdrawals) VALUES (?, ?, ?)",
//       [account_type, startAmount, 5]
//     );
//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// }


export async function createCurrent(uid, BId, startDate, startAmount) {
  try {
    const [rows] = await pool.query(
      "CALL makeCurrentAccount(?, ?, ?, ?, ?)",
      [uid, BId, startDate, startAmount, "current" ]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function createSavings(uid, BId, accountType, startDate, startAmount) {
  try {
    const [rows] = await pool.query(
      "CALL MakeSavingsAccount(?, ?, ?, ?, ?)",
      [uid, BId,accountType, startDate, startAmount ]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
