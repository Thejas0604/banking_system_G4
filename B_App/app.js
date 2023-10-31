// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { checkCredentials } from "./database/database.js";
import { getName } from "./database/database.js";
import { getSavingsAccountNo } from "./database/database.js";
import { getSavingsAccountBalance } from "./database/database.js";
import { getSavingsAccountWithdrawalsLeft } from "./database/database.js";
import { validateSavingsAccount } from "./database/database.js";
import { validateTransferAmount } from "./database/database.js";
import { getCurrentAccountNo } from "./database/database.js";
import { getCurrentAccountBalance } from "./database/database.js";

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

////////////////////////////////////////////////////////////////////////////
//authentication + dashboard

let isAuthenticated = false;
app.get("/", (req, res) => {
  res.render("login");
});

//basic details
let userId = "";
let name = "";
let user_type = "";

app.post("/dashboard", async (req, res) => {
  const name = req.body.name;
  const pw = req.body.password;



  await checkCredentials(name, pw).then(async (result) => {
    if (result) {
      userId = result[0].user_id;
      name = await getName(userId);
      user_type = result[0].user_type;

      if (user_type == "customer") {
        res.render("dashboard", {
          name: await getName(userId),
          savingsAccountNo: await getSavingsAccountNo(userId),
          savingsAccountBalance: await getSavingsAccountBalance(userId),
          WithdrawalsLeft: await getSavingsAccountWithdrawalsLeft(userId),
          currentAccountNo: await getCurrentAccountNo(userId),
          currentAccountBalance: await getCurrentAccountBalance(userId),
        }); //connect and render dashboard
        isAuthenticated = true;
      }
      else if (user_type == "employee") {
        res.send("employee dashboard")
      //   res.render("employeeDashboard", {
      //     name: await getName(result),
      //   }); //connect and render employee dashboard
      //   isAuthenticated = true;
      }
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", async (req, res) => {
  if (isAuthenticated) {
    res.render("dashboard.ejs", {
      name: name,
      savingsAccountNo: await getSavingsAccountNo(userId),
      savingsAccountBalance: await getSavingsAccountBalance(userId),
      WithdrawalsLeft: await getSavingsAccountWithdrawalsLeft(userId),
      currentAccountNo: await getCurrentAccountNo(userId),
      currentAccountBalance: await getCurrentAccountBalance(userId),
    });
  } else {
    res.redirect("/");
  }
});

////////////////////////////////////////////////////////////////////////////
//savings
app.get("/savings", async (req, res) => {
  res.render("savings", {
    name: name,
    savingsAccountNo: await getSavingsAccountNo(userId),
    savingsAccountBalance: await getSavingsAccountBalance(userId),
    WithdrawalsLeft: await getSavingsAccountWithdrawalsLeft(userId),
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

  const amount = parseFloat(req.body.amount);
  const validateAmount = await validateTransferAmount(amount, req.body.fromAccount);

  if ((validateSender == 1) && (validateReceiver == 1) && (validateAmount ) ) {
    res.render("savings-transfers-do", {
      status: "Successful",
    });
  } else {
    res.render("savings-transfers-do", {
      status: "Failed",
    });
  }
});

////////////////////////////////////////////////////////////////////////////
//current
app.get("/current",async (req, res) => {
  res.render("current", {
    name: name,
    currentAccountNo: await getCurrentAccountNo(userId),
    currentAccountBalance: await getCurrentAccountBalance(userId),
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
    fd_id: "210383L",
    amount: "LKR.5,000,000",
    period: "1 year",
    matuarity: "12/12/2021",
    startDate: "12/12/2020",
    endDate: "12/12/2021",
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
