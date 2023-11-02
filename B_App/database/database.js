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

//Transfers (Savings + Current)
export async function makeMoneyTransfer(sender_id, receiver_id, transfer_amount, callback) {
  pool.query(
    'CALL MakeMoneyTransfer(?, ?, ?)',
    [sender_id, receiver_id, transfer_amount],
    (err, results) => {
      if (err) {
        console.error('Error calling the stored procedure: ' + err.message);
        callback(err);
      } else {
        console.log('Money transfer successful');
        callback(null, results);
      }
    }
  );
}

//Get Current Account details
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
export async function getFDInfo(savingsAccountNo) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM fixed_deposit WHERE account_no = ?",
      [savingsAccountNo]
    );
    console.log(rows[0]);

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


export async function renderTransactions(uid) {
  try {
    const [rows,fields] = await pool.query(
      "CALL transactionreport(?)",
      [uid]
    );
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function onlineLoanRequest(uid, amount, duration) {
  try {
    const [rows] = await pool.query(
      "CALL applyFDLoan(?, ?, ?)",
      [uid, amount, duration]

    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function createCustomer(name, address, phone, age, username, password, cusType, nic, organizationType) {
  try {
    const [rows] = await pool.query(
      "CALL createCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, address, phone, age, username, password, cusType, nic, organizationType]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getBranchReport(branchID) {
  try {
    const [rows] = await pool.query(
      "CALL branchbankreport(?)", [branchID]
    );
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
}


export async function getLoanDetails(cusID) {
  try {
    const [rows] = await pool.query(
      "CALL getLoanDetails(?)", [cusID] //wrong
    );
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
}