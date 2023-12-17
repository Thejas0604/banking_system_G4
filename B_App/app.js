// 1. Install necessary dependencies
import bcrypt from "bcrypt";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import {
  checkCredentials,
  getCDetails,
  getCusId,
  getEDetails,
  createCurrent,
  createSavings,
  createCustomer,
  getBranchReport,
  getLoanDetails,
  callLateLoanPayments,
  checkLoansToBeApproved,
  requestLoan,
} from "./database/database.js";
import { getSavTypeDetails, createFD } from "./database/database.js";
import { getSavingsDetails } from "./database/database.js";
import { getCurrentDetails } from "./database/database.js";
import { makeMoneyTransfer } from "./database/database.js";
import { renderTransactions } from "./database/database.js";
import { getFDInfo } from "./database/database.js";
import { onlineLoanRequest } from "./database/database.js";
import { authenticateAdminToken, authenticateUserToken } from "./auth.js";

// Set up the express app
const app = express();
const saltRounds = 10;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

////////////////////////////////////////////////////////////////////////////
//authentication + dashboard

// let isAuthenticated = false;
app.get("/", (req, res) => {
  res.render("login");
});

//basic details
let userId = "";
let name = "";
let user_type = "";

app.post("/dashboard", async (req, res) => {
  const userName = req.body.username;
  const pw = req.body.password;

  await checkCredentials(userName, pw).then(async (result) => {
    if (result) {
      userId = result[0].user_id;
      user_type = result[0].user_type;

      //authorization
      const token = jwt.sign(
        { un: userName, role: "user" },
        "jwt_User_privateKey", ///this is a password ///////////
        { expiresIn: "10m" }
      );
      console.log(token);

      res.cookie("jwt", token, { httpOnly: true }); // Token will expire in 20 min (1200000 ms)

      if (user_type == "customer") {
        let cDet = await getCDetails(userId);
        let sDet = await getSavingsDetails(userId);
        let cuDet = await getCurrentDetails(userId);
        let transactions = await renderTransactions(userId);

        let savingsAccountNo;
        let savingsAccountBalance;
        let withdrawalsLeft;
        let currentAccountNo;
        let currentAccountBalance;

        if (sDet != undefined) {
          savingsAccountNo = sDet.account_no;
          savingsAccountBalance = sDet.balance;
          withdrawalsLeft = sDet.remaining_withdrawals;
        }
        if (cuDet != undefined) {
          currentAccountNo = cuDet.account_no;
          currentAccountBalance = cuDet.balance;
        }
        console.log(transactions[0]);
        res.render("dashboard", {
          name: cDet.name,
          savingsAccountNo: savingsAccountNo,
          savingsAccountBalance: savingsAccountBalance,
          withdrawalsLeft: withdrawalsLeft,
          currentAccountNo: currentAccountNo,
          currentAccountBalance: currentAccountBalance,
          transactions: transactions[0],
        });
      } else if (user_type == "employee") {
        let eDet = await getEDetails(userId);

        res.render("employeeDash", {
          name: eDet.name,
          role: eDet.role,
        });
      }
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", authenticateUserToken, async (req, res) => {
  // if (isAuthenticated) {

  if (user_type == "customer") {
    let cDet = await getCDetails(userId);
    let sDet = await getSavingsDetails(userId);
    let cuDet = await getCurrentDetails(userId);
    let transactions = await renderTransactions(userId);

    let savingsAccountNo;
    let savingsAccountBalance;
    let withdrawalsLeft;
    let currentAccountNo;
    let currentAccountBalance;

    if (sDet != undefined) {
      savingsAccountNo = sDet.account_no;
      savingsAccountBalance = sDet.balance;
      withdrawalsLeft = sDet.remaining_withdrawals;
    }
    if (cuDet != undefined) {
      currentAccountNo = cuDet.account_no;
      currentAccountBalance = cuDet.balance;
    }
    res.render("dashboard", {
      name: cDet.name,
      savingsAccountNo: savingsAccountNo,
      savingsAccountBalance: savingsAccountBalance,
      withdrawalsLeft: withdrawalsLeft,
      currentAccountNo: currentAccountNo,
      currentAccountBalance: currentAccountBalance,
      transactions: transactions[0],
    });
  } else if (user_type == "employee") {
    let eDet = await getEDetails(userId);

    res.render("employeeDash.ejs", {
      name: eDet.name,
      role: eDet.role,
    });
  }
});

////////////////////////////////////////////////////////////////////////////
//savings for customer view
app.get("/savings", authenticateUserToken, async (req, res) => {
  let cDet = await getCDetails(userId);
  let sDet = await getSavingsDetails(userId);
  let sType = await getSavTypeDetails(sDet.account_type);

  res.render("savings", {
    name: cDet.name,
    savingsAccountNo: sDet.account_no,
    savingsAccountBalance: sDet.balance,
    withdrawalsLeft: sDet.remaining_withdrawals,
    accountType: sDet.account_type,
    interestRate: sType.interest_rate, ///////////////////////////////////////////////////////////// check
  });
});

////////////////////////////////////////////////////////////////////////////
//transfers-savings
app.get("/transfers-savings", authenticateUserToken, async (req, res) => {
  let savingsdet = await getSavingsDetails(userId);
  let savingsAccountNo;
  if (savingsdet != undefined) {
    savingsAccountNo = savingsdet.account_no;
  }
  res.render("transfers-savings", {
    fromAccount: savingsAccountNo,
  });
});

//transfers-current
app.get("/transfers-current", authenticateUserToken, async (req, res) => {
  let currentDet = await getCurrentDetails(userId);
  let currentAccountNo;
  if (currentDet != undefined) {
    currentAccountNo = currentDet.account_no;
  }
  console.log(currentAccountNo);
  console.log(currentDet);
  res.render("transfers-current", {
    fromAccount: currentAccountNo,
  });
});
////////////////////////////////////////////////////////////////////////////

//transfers-do
app.post("/transfer-do", async (req, res) => {
  const sender = req.body.fromAccount;
  const receiver = req.body.toAccount;
  const amount = req.body.amount;
  try {
    let results = await makeMoneyTransfer(sender, receiver, amount);
    if (results === false) {
      res.render("transfers-do", { status: "Failed" });
    } else {
      res.render("transfers-do", { status: "Successful" });
    }
  } catch (err) {
    console.log(err);
  }
});

////////////////////////////////////////////////////////////////////////////
//current
app.get("/current", authenticateUserToken, async (req, res) => {
  console.log(userId);
  let cDet = await getCDetails(userId);
  let cuDet = await getCurrentDetails(userId);

  res.render("current", {
    name: cDet.name,
    currentAccountNo: cuDet.account_no,
    currentAccountBalance: cuDet.balance,
  });
});

////////////////////////////////////////////////////////////////////////////
//Fixed-Deposits

app.get("/fd", authenticateUserToken, async (req, res) => {
  let savingsData = await getSavingsDetails(userId);
  let fdData = await getFDInfo(savingsData.account_no);

  let fd_id;
  let amount;
  let start_date;
  let end_date;
  let duration;
  let rate;
  let loanID = await getLoanDetails(userId);

  if (fdData != undefined) {
    fd_id = fdData.fd_id;
    amount = fdData.amount;
    start_date = fdData.start_date;
    end_date = fdData.end_date;
    duration = fdData.duration;
    rate = fdData.rate;
  }
  res.render("fd", {
    loanID: loanID,
    fd_id: fd_id,
    amount: amount,
    startDate: start_date,
    endDate: end_date,
    rate: rate,
    duration: duration,
  });
});

////////////////////////////////////////////////////////////////////////////
//loan-request

app.post("/request-loan-online", async (req, res) => {
  const amount = req.body.amount;
  const duration = req.body.duration;
  let result = await onlineLoanRequest(userId, amount, duration);
  if (result == true) {
    result = "Loan successfully applied.";
  } else {
    result = "Loan application failed.";
  }
  res.render("loanRequests-online", { status: result });
});

////////////////////////////////////////////////////////////////////////////
//Loans
app.get("/loan", authenticateUserToken, async (req, res) => {
  const loanDet = await getLoanDetails(userId);
  res.render("loan", {
    loanID: loanDet[0][0].loan_id,
    amount: loanDet[0][0].loan_amount,
    Remins: loanDet[0][0].remaining_installments,
  });
});

//////////////////////////////////////////////////////////////////////
//employee dashboard

app.post("/searched-customer", authenticateUserToken, async (req, res) => {
  console.log(req.body.customerSearch);
  const cusId = await getCusId(req.body.customerSearch);

  if (cusId == false) {
    res.redirect("/dashboard");
  } else {
    let cDet = await getCDetails(cusId);
    let sDet = await getSavingsDetails(cusId);
    let cuDet = await getCurrentDetails(cusId);
    let loanDets = await getLoanDetails(cusId);

    if (cDet == undefined) {
      res.redirect("/dashboard");
    } else {
      let savingsAccountNo;
      let savingsAccountBalance;
      let withdrawalsLeft;
      let currentAccountNo;
      let currentAccountBalance;
      let accountType;
      let savingsBId;
      let currentBId;
      let name;
      let address;
      let phone;
      let fdAmount;
      let fdStart;
      let fdDuration;
      let fdRate;
      let fdDet;
      let loanDet;

      if (loanDets != undefined) {
        try {
          loanDet = loanDets[0][0];
        } catch (error) {
          console.log(error);
          loanDet = false;
        }
      }
      if (cDet != undefined) {
        name = cDet.name;
        address = cDet.address;
        phone = cDet.telephone;
      }

      if (sDet != undefined) {
        savingsAccountNo = sDet.account_no;
        savingsAccountBalance = sDet.balance;
        withdrawalsLeft = sDet.remaining_withdrawals;
        accountType = sDet.account_type;
        savingsBId = sDet.branch_id;
        fdDet = await getFDInfo(savingsAccountNo);

        if (fdDet != undefined) {
          fdAmount = fdDet.amount;
          fdStart = fdDet.start_date;
          fdDuration = fdDet.duration;
          fdRate = fdDet.rate;
        }
      }
      if (cuDet != undefined) {
        currentAccountNo = cuDet.account_no;
        currentAccountBalance = cuDet.balance;
        currentBId = cuDet.branch_id;
      }
      console.log(loanDet);
      res.render("customer", {
        name: name,
        account_type: accountType,
        address: address,
        phone: phone,
        savingsAccountNo: savingsAccountNo,
        savingsAccountBalance: savingsAccountBalance,
        withdrawalsLeft: withdrawalsLeft,
        savingsBId: savingsBId,
        currentAccountNo: currentAccountNo,
        currentAccountBalance: currentAccountBalance,
        currentBId: currentBId,
        fd_exist: fdStart, /////////////////////////change
        loan_exist: false,
        cusId: cusId,
        fdAmount: fdAmount,
        fdStart: fdStart,
        fdDuration: fdDuration,
        fdRate: fdRate,
        fdStart: fdStart,
        loan_exist: loanDet,
      });
    }
  }
});

app.get("/approve-loan", authenticateUserToken, (req, res) => {
  res.render("loan-approve.ejs");
});

app.get("/searched-customer", authenticateUserToken, async (req, res) => {
  res.redirect("/dashboard");
});

app.get("/create-customer", authenticateUserToken, (req, res) => {
  res.render("create-customer");
});

app.post("/created-customer", authenticateUserToken, (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const age = req.body.age;
  const username = req.body.username;
  const password = req.body.password;
  const cusType = req.body.customer_type;
  const nic = req.body.nic;
  const organizationType = req.body.organization_type;

  createCustomer(
    name,
    address,
    phone,
    age,
    username,
    password,
    cusType,
    nic,
    organizationType
  );

  res.redirect("/dashboard");
});

app.post("/add-account", authenticateUserToken, (req, res) => {
  const cusId = req.body.cusId;

  const acc_t = req.body.acc_t;

  res.render("add-account", {
    cusId: cusId,
    acc_t: acc_t,
  });
});

app.post("/added-savings", authenticateUserToken, (req, res) => {
  const cusId = req.body.cus_id;
  const BId = req.body.branch_id;
  const startDate = new Date();
  const startAmount = req.body.start_amount;
  const accountType = req.body.account_type;

  createSavings(cusId, BId, accountType, startDate, startAmount);

  res.redirect("/dashboard");
});

app.post("/added-current", authenticateUserToken, (req, res) => {
  const cusId = req.body.cus_id;
  const BId = req.body.branch_id;
  const startDate = new Date();
  const startAmount = req.body.start_amount;

  console.log(cusId, BId, startDate, startAmount);
  const hi = createCurrent(cusId, BId, startDate, startAmount);
  console.log(hi);

  res.redirect("/dashboard");
});

app.post("/add-fd", authenticateUserToken, (req, res) => {
  const cusId = req.body.cusId;
  res.render("add-fd", {
    cusId: cusId,
  });
});

app.post("/added-fd", authenticateUserToken, async (req, res) => {
  const cusId = req.body.cus_id;
  const amount = req.body.fd_amount;
  const duration = req.body.duration;
  const fd = await createFD(cusId, amount, duration);
  res.redirect("/dashboard");
});

app.post("/request-loan", authenticateUserToken, (req, res) => {
  const cusId = req.body.cusId;
  res.render("request-loan", {
    cusId: cusId,
  });
});

app.get("/request-loan", authenticateUserToken, (req, res) => {
  res.render("/request-loan");
});

app.post("/requested-loan", authenticateUserToken, async (req, res) => {
  const cusId = req.body.cus_id;
  const amount = req.body.loan_amount;
  const rate = req.body.interest_rate;
  const no_installments = req.body.installment_nos;

  await requestLoan(cusId, amount, rate, no_installments, userId);

  res.redirect("/dashboard");
});

////////////////////////////////////////////////////
///Managers priviledges

app.get("/late-loan-payments", authenticateUserToken, async (req, res) => {
  const lateLoanPayments1 = await callLateLoanPayments(); /// only unapproved loans --  array of json objects

  res.render("late-loan-payments", {
    lateLoanPayments: lateLoanPayments1[0],
  });
});

app.get("/loans-to-approve", authenticateUserToken, async (req, res) => {
  const loansToApprove1 = await checkLoansToBeApproved(); /// only unapproved loans --  array of json objects

  res.render("loans-to-approve", {
    loansToApprove: loansToApprove1[0],
  });
});

app.get("/approve-loan/:id", authenticateUserToken, async (req, res) => {
  const loanRequestId = req.params.id;

  // approveLoanRequest(loanRequestId);
  res.redirect("/loans-to-approve");
});

app.post("/generate-branch-report", authenticateUserToken, async (req, res) => {
  const BId = req.body.branch_id;

  const branchReport = await getBranchReport(BId); /// only unapproved loans --  array of json objects

  res.render("branch-report", {
    BId: BId,
    branchReport: branchReport[0],
  });
});

////////////////////////////////////////////////////////////////////////////
//logout
app.get("/logout", authenticateUserToken, (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

////////////////////////////////////////////////////////////////////////////
//about page
app.get("/about", authenticateUserToken, (req, res) => {
  res.render("about.ejs");
});

////////////////////////////////////////////////////////////////////////////
//contact page
app.get("/contact", authenticateUserToken, (req, res) => {
  res.render("contact.ejs");
});

////////////////////////////////////////////////////////////////////////////
//starting server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
