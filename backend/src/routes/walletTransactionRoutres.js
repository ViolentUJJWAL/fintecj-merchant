const express = require("express");
const jwtToken = require('../../middlewares/jwtToken');
const { addMoney, withdrawMoney, transferMoney, getAllTransactions, setPaymentPin, checkPinSet, uniqueUsersIntransactions, findUserByPaymentId } = require("../controllers/walletTransactionController");

const router = express.Router();

// Add money to wallet
router.post("/:userType/add-money", jwtToken, addMoney);

// Withdraw money from wallet
router.post("/:userType/withdraw-money", jwtToken, withdrawMoney);

// Transfer money
router.post("/:userType/transfer-money", jwtToken, transferMoney);

// Get all transactions
router.get("/:userType/transactions", jwtToken, getAllTransactions);

// set payment pin
router.put("/:userType/set-pin/verifyPassword", jwtToken, setPaymentPin.verifyPassword);
router.put("/:userType/set-pin/setupPaymentPin", jwtToken, setPaymentPin.setupPaymentPin);

router.get("/:userType/check-pinset", jwtToken, checkPinSet);

router.get("/:userType/unique-users", jwtToken, uniqueUsersIntransactions);
router.get("/findUserByPaymentId/:paymentId", jwtToken, findUserByPaymentId);

module.exports = router;
