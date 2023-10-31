// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { checkCredentials, getCDetails, getCusId, getEDetails } from "./database/database.js";
import { getSavTypeDetails } from "./database/database.js";
import { getSavingsDetails } from "./database/database.js";
import { validateSavingsAccount } from "./database/database.js";
import { validateTransferAmount } from "./database/database.js";
import { getCurrentDetails } from "./database/database.js";
import { authenticateAdminToken, authenticateUserToken } from "./auth.js"

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

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
  const userName = req.body.username;
  const pw = req.body.password;

  await checkCredentials(userName, pw).then(async (result) => {
    if (result) {
      userId = result[0].user_id;
      user_type = result[0].user_type;

      if (user_type == "customer") {

        const token = jwt.sign(
          { un: userName, role: "customer" },
          "jwt_User_privateKey",  ///this is a password ///////////
          { expiresIn: "5m" }
        );
        console.log(token);

        res.cookie("jwt", token, { httpOnly: true }); // Token will expire in 20 min (1200000 ms)


        let cDet = await getCDetails(userId);
        let sDet =  await getSavingsDetails(userId);
        let cuDet=  await getCurrentDetails(userId);

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
          "name": cDet.name,
          "savingsAccountNo": savingsAccountNo,
          "savingsAccountBalance": savingsAccountBalance,
          "withdrawalsLeft": withdrawalsLeft,
          "currentAccountNo": currentAccountNo,
          "currentAccountBalance": currentAccountBalance
      });
     

        isAuthenticated = true;
      }

      else if (user_type == "employee") {

        const token = jwt.sign(
          { un: userName, role: "employee" },
          "jwt_Admin_privateKey",  ///this is a password ///////////
          { expiresIn: "5m" }
        );
        console.log(token);

        res.cookie("jwt", token, { httpOnly: true }); // Token will expire in 20 min (1200000 ms)

        let eDet = await getEDetails(userId);

        res.render("employeeDash", {
          "name": eDet.name


        });     
        isAuthenticated = true;
      }
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", async (req, res) => {
  if (isAuthenticated) {

    if (user_type == "customer") {

      let cDet = await getCDetails(userId);
      let sDet =  await getSavingsDetails(userId);
      let cuDet=  await getCurrentDetails(userId);
  
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
          "name": cDet.name,
          "savingsAccountNo": savingsAccountNo,
          "savingsAccountBalance": savingsAccountBalance,
          "withdrawalsLeft": withdrawalsLeft,
          "currentAccountNo": currentAccountNo,
          "currentAccountBalance": currentAccountBalance
        }); 
    }else if (user_type == "employee") {
      let eDet = await getEDetails(userId);

      res.render("employeeDash.ejs", {
        "name": eDet.name,  

      });
    }
  }else {
    res.redirect("/");
  }
    

});

////////////////////////////////////////////////////////////////////////////
//savings
app.get("/savings", authenticateAdminToken , async (req, res) => {

  let cDet = await getCDetails(userId);
  let sDet =  await getSavingsDetails(userId);
  let sType = await getSavTypeDetails(sDet.account_type);

  res.render("savings", {
    "name": cDet.name,
    "savingsAccountNo": sDet.account_no,
    "savingsAccountBalance": sDet.balance,
    "withdrawalsLeft": sDet.remaining_withdrawals,
    "accountType": sDet.account_type,
    "interestRate": sType.interest_rate  ///////////////////////////////////////////////////////////// check
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
  console.log(userId);
  let cDet = await getCDetails(userId);
  let cuDet=  await getCurrentDetails(userId);
  
  res.render("current", {
    "name": cDet.name,
    "currentAccountNo": cuDet.account_no ,
    "currentAccountBalance": cuDet.balance,
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
  res.clearCookie("jwt");
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


//////////////////////////////////////////////////////////////////////
//employee dashboard

app.post("/search-customer", async (req, res) => {
  console.log(req.body.customerSearch)
  const cusId = await getCusId(req.body.customerSearch) ;

  if (cusId == false) {
    res.redirect("/dashboard");
  }
  else{
    let cDet = await getCDetails(cusId);
    let sDet =  await getSavingsDetails(cusId);
    let cuDet=  await getCurrentDetails(cusId);
  
    let savingsAccountNo;
    let savingsAccountBalance;
    let withdrawalsLeft;
    let currentAccountNo; 
    let currentAccountBalance;
    let accountType;
    let savingsBId;
    let currentBId;
  
  
    if (sDet != undefined) {
      savingsAccountNo = sDet.account_no;
      savingsAccountBalance = sDet.balance;
      withdrawalsLeft = sDet.remaining_withdrawals;
      accountType = sDet.account_type;
  
    }
    if (cuDet != undefined) {
      currentAccountNo = cuDet.account_no;
      currentAccountBalance = cuDet.balance;
    }
  
    res.render("customer",{
      "name": cDet.name,
      "account_type": accountType,
      "address": cDet.address,
      "phone": cDet.telephone,
      "savingsAccountNo": savingsAccountNo,
      "savingsAccountBalance": savingsAccountBalance,
      "withdrawalsLeft": withdrawalsLeft,
      "savingsBId": savingsBId,
      "currentAccountNo": currentAccountNo,
      "currentAccountBalance": currentAccountBalance,
      "currentBId": currentBId,
    });
  }

});

