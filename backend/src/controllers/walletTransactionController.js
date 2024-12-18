const { encrypt, decrypt } = require("../../utils/cryptoFunc");
const generateToken = require("../../utils/generateToken");
const hashPassword = require("../../utils/password");
const sendEmail = require("../../utils/sendMail");
const Customer = require("../models/customerModel");
const Merchant = require("../models/merchantModel");
const WalletTransaction = require("../models/walletTransactionModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Add Money to Wallet
exports.addMoney = async (req, res) => {
    const { amount, pin } = req.body;
    const userId = req.user._id;
    const userType = req.params.userType;
    try {
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const userModel = userType === "Customer" ? Customer : Merchant;
        const user = await userModel.findById(userId).select("+paymentPin");

        if (!user) {
            return res.status(404).json({ error: `${userType} not found` });
        }

        if (user.paymentPin === null) return res.status(400).json({ error: "Ternsaction pin not set" });

        const isMatchPin = await bcrypt.compare(pin, user.paymentPin);
        if (!isMatchPin) return res.status(400).json({ error: "Invalid ternsaction pin" });

        user.walletBalance += parseFloat(amount);
        await user.save();

        await WalletTransaction.create({
            transactionType: "ADD",
            amount,
            to: userId,
            toModel: userType,
        });

        return res.status(200).json({ message: "Money added successfully", balance: user.walletBalance });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Withdraw Money from Wallet
exports.withdrawMoney = async (req, res) => {
    const { amount, pin } = req.body;
    const userId = req.user._id;
    const userType = req.params.userType;
    try {
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const userModel = userType === "Customer" ? Customer : Merchant;
        const user = await userModel.findById(userId).select("+paymentPin");

        if (!user) {
            return res.status(404).json({ error: `${userType} not found` });
        }

        if (user.paymentPin === null) return res.status(400).json({ error: "Ternsaction pin not set" });

        const isMatchPin = await bcrypt.compare(pin, user.paymentPin);
        if (!isMatchPin) return res.status(400).json({ error: "Invalid ternsaction pin" });

        if (user.walletBalance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        user.walletBalance -= parseFloat(amount);
        await user.save();

        await WalletTransaction.create({
            transactionType: "WITHDRAW",
            amount,
            from: userId,
            fromModel: userType,
        });

        return res.status(200).json({ message: "Money withdrawn successfully", balance: user.walletBalance });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const findToUser = async (paymentId) => {
    const customerUser = await Customer.findOne({ paymentId });
    if (customerUser) return { user: customerUser, userType: "Customer" };
    const merchantUser = await Merchant.findOne({ paymentId });
    if (merchantUser) return { user: merchantUser, userType: "Merchant" };
    return null;
}


// Transfer Money
exports.transferMoney = async (req, res) => {
    const { toUserPaymentId, amount, pin, refund } = req.body;
    const fromId = req.user._id;
    const fromType = req.params.userType;
    try {
        if (parseFloat(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const fromModel = fromType === "Customer" ? Customer : Merchant;

        const fromUser = await fromModel.findById(fromId).select("+paymentPin");
        const toUser = await findToUser(toUserPaymentId);

        if (!fromUser || !toUser) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        if (fromUser.paymentPin === null) return res.status(400).json({ error: "Ternsaction pin not set" });

        const isMatchPin = await bcrypt.compare(pin, fromUser.paymentPin);
        if (!isMatchPin) return res.status(400).json({ error: "Invalid ternsaction pin" });

        if (fromUser.walletBalance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        fromUser.walletBalance -= parseFloat(amount);
        toUser.user.walletBalance += parseFloat(amount);

        await fromUser.save();
        await toUser.user.save();

        await WalletTransaction.create({
            transactionType: "TRANSFER",
            amount,
            from: fromUser._id,
            fromModel: fromType,
            to: toUser.user._id,
            toModel: toUser.userType,
        });

        return res.status(200).json({ message: "Money transferred successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllTransactions = async (req, res) => {
    const { transactionType } = req.query;
    const userId = req.user._id;
    const userType = req.params.userType;
    try {
        const filter = {};

        if (userId && userType) {
            filter.$or = [
                { from: userId, fromModel: userType },
                { to: userId, toModel: userType },
            ];
        }

        if (transactionType) {
            filter.transactionType = transactionType;
        }

        const transactions = await WalletTransaction.find(filter)
            .populate("from", "name email paymentId")
            .populate("to", "name email paymentId")
            .sort({ createdAt: -1 }); // Sort by latest transactions

        return res.status(200).json({
            message: "Transactions fetched successfully",
            count: transactions.length,
            transactions,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.setPaymentPin = {
    verifyPassword: async (req, res) => {
        const { password } = req.body
        const userType = req.params.userType;
        if (!password) return res.status(400).json({ error: "Password are required." });
        try {
            const userModel = userType === "Customer" ? Customer : Merchant;
            const user = await userModel.findById(req.user._id).select("+paymentPin +password");
            if (!user) return res.status(404).json({ error: "User not found" });
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) return res.status(400).json({ error: "Invalid password" });
            const otp = await (Math.floor(100000 + Math.random() * 900000)).toString();
            const otpSend = await sendEmail(user.email, "OTP for reg. email verification", `<h1>${otp}</h1>`)
            if (!otpSend) return res.status(500).json({ error: "Otp not send." });
            const encryptOtp = await hashPassword(otp.toString())
            const securityPin = encrypt(generateToken({ passwordVerify: true, otp: encryptOtp }))
            res.cookie("securityPin", securityPin, {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })
            return res.status(200).json({ message: "Password verify and otp send to your email." })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    setupPaymentPin: async (req, res) => {
        const { pin, otp } = req.body
        const userType = req.params.userType;
        if (!pin || !otp) return res.status(400).json({ error: "Payment pin and Otp are required." });
        try {
            const userModel = userType === "Customer" ? Customer : Merchant;
            const user = await userModel.findById(req.user._id).select("+paymentPin");
            if (!user) return res.status(404).json({ error: "User not found" });
            const securityPin = decrypt(await req.cookies.securityPin)
            if (!securityPin) return res.status(400).json({ error: "Cookie not set." });
            const cookieData = await jwt.verify(securityPin, process.env.JWT_SECRET);
            const isMatchOtp = await bcrypt.compare(otp, cookieData.otp);
            if (!isMatchOtp) {
                return res.status(400).json({ error: "Wrong OTP" }); // Ensure the function exits here
            }
            user.paymentPin = await hashPassword(pin)
            await user.save()
            return res.status(200).json({ message: "Payment pin change successfully" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

exports.checkPinSet = async (req, res) => {
    const userType = req.params.userType;
    try {
        const userModel = userType === "Customer" ? Customer : Merchant;
        const user = await userModel.findById(req.user._id).select("+paymentPin");
        if (!user) return res.status(404).json({ error: "user not found." });
        if (user.paymentPin === null) return res.status(400).json({ error: "Payment pin not set." });
        return res.status(200).json({ message: "paymant pin is present" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.uniqueUsersIntransactions = async (req, res) => {
    try {
        const currentMerchantId = req.user._id; // Assuming middleware adds user ID to req.user

        // Validate if the current user is a merchant
        const transactions = await WalletTransaction.find({ $or: [{ from: currentMerchantId }, { to: currentMerchantId }], transactionType: "TRANSFER" })
            .populate("from", "name paymentId profile")
            .populate("to", "name paymentId profile")
            .sort({ createdAt: -1 });

        if (!transactions) {
            return res.status(403).json({ message: "Unauthorized: Not a valid merchant." });
        }

        // Extract unique users who transferred to the logged-in merchant
        const uniqueUsers = [];

        transactions.forEach((transaction) => {
            if (transaction.to) {
                if (!(transaction.to._id.equals(currentMerchantId)) && !(uniqueUsers.includes(transaction.to))) {
                    uniqueUsers.push(transaction.to)
                }
            }
            if (transaction.from) {
                if (!(transaction.from._id.equals(currentMerchantId)) && !(uniqueUsers.includes(transaction.from))) {
                    uniqueUsers.push(transaction.from)
                }
            }
        });

        return res.status(200).json({
            message: "get unique user in transaction",
            uniqueUsers,
        });
    } catch (error) {
        console.error("Error fetching merchant transfers:", error);
        return res.status(500).json({ message: "An error occurred while fetching merchant transfers." });
    }
};

exports.findUserByPaymentId = async(req, res) => {
    try {
        const { paymentId } = req.params
        if(!paymentId) return res.status(400).json({error: "enter paymentId."});
        const user = await findToUser(paymentId);
        if(!user) return res.status(404).json({error: "User not found." });
        return res.status(200).json({message: "get user", data: {name: user.user.name, paymentId: user.user.paymentId} })
    } catch (error) {
        console.error("Error fetching merchant transfers:", error);
        return res.status(500).json({ message: "An error occurred while fetching user." });
    }
}