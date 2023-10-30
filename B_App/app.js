// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { checkCredentials } from "./database/database.js";
import { getUserName } from "./database/database.js";
import { getSavingsAccountNo } from "./database/database.js";
import { getSavingsAccountBalance } from "./database/database.js";
import { getSavingsAccountWithdrawalsLeft } from "./database/database.js";
import { validateSavingsAccount } from "./database/database.js";

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

////////////////////////////////////////////////////////////////////////////
//authentication + dashboard
let user_id;
let USERNAME;
let isAuthenticated = false;
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/dashboard", async (req, res) => {
  user_id = req.body.userID;
  USERNAME = await getUserName(user_id);
  const pw = req.body.password;

  await checkCredentials(user_id, pw).then(async (result) => {
    if (result) {
      res.render("dashboard", {
        userName: USERNAME,
        savingsAccountNo: await getSavingsAccountNo(user_id),
        savingsAccountBalance: await getSavingsAccountBalance(user_id),
        WithdrawalsLeft: await getSavingsAccountWithdrawalsLeft(user_id),
        currentAccountNo: "210383L",
        currentAccountBalance: 5000,
      }); //connect and render dashboard
      isAuthenticated = true;
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", async (req, res) => {
  if (isAuthenticated) {
    res.render("dashboard.ejs", {
      userName: USERNAME,
      savingsAccountNo: await getSavingsAccountNo(user_id),
      savingsAccountBalance: await getSavingsAccountBalance(user_id),
      WithdrawalsLeft: await getSavingsAccountWithdrawalsLeft(user_id),
      currentAccountNo: "210383L",
      currentAccountBalance: 5000,
    });
  } else {
    res.redirect("/");
  }
});

////////////////////////////////////////////////////////////////////////////
//savings
app.get("/savings", async (req, res) => {
  res.render("savings", {
    userName: USERNAME,
    savingsAccountNo: await getSavingsAccountNo(user_id),
    savingsAccountBalance: await getSavingsAccountBalance(user_id),
    WithdrawalsLeft: await getSavingsAccountWithdrawalsLeft(user_id),
    interestRate: "10%",
  });
});

////////////////////////////////////////////////////////////////////////////
//savings-transfers
app.get("/transfers-savings", async (req, res) => {
  res.render("savings-transfers");
});

////////////////////////////////////////////////////////////////////////////
//savings-transfers-confirmation
app.post("/transfer-savings-do", async (req, res) => {
  const validateSender = await validateSavingsAccount(req.body.fromAccount);
  const validateReceiver = await validateSavingsAccount(req.body.toAccount);

  const amount = req.body.amount;

  if ((validateSender == 1) && (validateReceiver == 1)) {
    res.render("savings-transfers-do", {
      status: "Success",
    });
  } else {
    res.render("savings-transfers-do", {
      status: "Failed",
    });
  }
});

////////////////////////////////////////////////////////////////////////////
//current
app.get("/current", (req, res) => {
  res.render("current", {
    userName: USERNAME,
    currentAccountNo: "210383L",
    currentAccountBalance: 5000,
    interestRate: "10%",
  });
});

////////////////////////////////////////////////////////////////////////////
//current-transfers
app.get("/transfers-current", (req, res) => {
  res.render("current-transfers");
});

////////////////////////////////////////////////////////////////////////////
//Fixed-Deposits
app.get("/fd", (req, res) => {
  res.render("fd", {
    status: "Active",
    accountNo: "210383L",
    balance: "LKR.5,000,000",
    period: "1 year",
    matuarity: "12/12/2021",
    startDate: "12/12/2020",
    rate: "17.5%",
  });
});

////////////////////////////////////////////////////////////////////////////
//loan-request
app.post("/request-loan", (req, res) => {
  const amount = req.body.amount;
  const duration = req.body.duration;
  res.render("loanRequests", { amount: amount, duration: duration });
});

////////////////////////////////////////////////////////////////////////////
//Loans
app.get("/loan", (req, res) => {
  res.render("loan", {
    interestRate: "7.5%",
    accountNo: "210383L",
    loanAmount: "LKR.5,000,000",
    duration: "1 year",
    remainingPeriod: "11 months",
    totalInterest: "LKR.375,000",
    oneInstallment: "LKR.468,750",
    noOfInstallmets: "12",
    payPerIns: "LKR.39,062.50",
  });
});

////////////////////////////////////////////////////////////////////////////
//logout
app.get("/logout", (req, res) => {
  isAuthenticated = false;
  res.redirect("/");
});

////////////////////////////////////////////////////////////////////////////
//about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

////////////////////////////////////////////////////////////////////////////
//contact page
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

////////////////////////////////////////////////////////////////////////////
//starting server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
