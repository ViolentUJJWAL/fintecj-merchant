const mongoose = require("mongoose");
const { encrypt, decrypt, isEncrypted } = require("../../utils/cryptoFunc");

// Schema for Merchant Information
const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address."]
  },
  phoneNo: {
    type: String,
    required: [true, "Phone number is required."],
    match: [/^\d{10,15}$/, "Invalid phone number."]
  },
  loginId: {
    type: String,
    default: null
  },
  paymentId: {
    type: String,
    trime: true,
    default: null,
  },
  paymentPin:{
    type: String,
    default: null,
    minlength: [4, "Pin must be at least 4 characters long."],
    select: false,
  },
  password: {
    type: String,
    default: null,
    minlength: [8, "Password must be at least 8 characters long."],
    select: false,
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required.'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required.'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required.'],
      match: [/^\d{4,10}$/, 'Invalid postal code.'],
    },
    country: {
      type: String,
      required: [true, 'Country is required.'],
      trim: true,
    },
  },
  isVerify: {
    type: Boolean,
    default: false
  },
  isActive:{
    type: Boolean,
    default: false
  },
  bankInformation: {
    branchCode: {
      type: String,
      required: [true, "Branch Code is required."]
    },
    accountType: {
      type: String,
      required: [true, "Bank account name is required."]
    },
    accountHolder: {
      type: String,
      required: [true, "Account holder name is required."]
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required."]
    },
    branchName: {
      type: String,
      required: [true, "Bank branch name is required."]
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required."]
    },
  },
  profile: {
    url: {
      type: String,
      required: [true, "profile URL is required."]
    },
    public_id: {
      type: String,
      required: [true, "profile file public ID is required."],
    }
  },
  govId: {
    url: {
      type: String,
      required: [true, "Government ID file URL is required."]
    },
    public_id: {
      type: String,
      required: [true, "Government ID file public ID is required."],
    }
  },
  businessLicense: {
    url: {
      type: String,
      required: [true, "Business license file URL is required."]
    },
    public_id: {
      type: String,
      required: [true, "Business license file public ID is required."]
    }
  },
  taxDocument: {
    url: {
      type: String,
      required: [true, "Tax document file URL is required."]
    },
    public_id: {
      type: String,
      required: [true, "Tax document file public ID is required."]
    }
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: [0, "Payout balance cannot be negative."]
  },
  passwordResetToken:{
    type: String
  },
  passwordResetExpires:{
    type: Date
  },
}, { timestamps: true });

// Middleware to encrypt bank information before saving
merchantSchema.pre("save", function (next) {
  if (this.isModified("bankInformation")) {
    const fieldsToEncrypt = ["branchCode", "accountType", "accountHolder", "bankName", "branchName", "accountNumber"];
    fieldsToEncrypt.forEach((field) => {
      if (!isEncrypted(this.bankInformation[field])) {
        this.bankInformation[field] = encrypt(this.bankInformation[field]);
      }
    });
  }

  if (this.isModified("govId")) {
    if (!isEncrypted(this.govId.url)) {
      this.govId.url = encrypt(this.govId.url);
    }
    if (!isEncrypted(this.govId.public_id)) {
      this.govId.public_id = encrypt(this.govId.public_id);
    }
  }

  if (this.isModified("businessLicense")) {
    if (!isEncrypted(this.businessLicense.url)) {
      this.businessLicense.url = encrypt(this.businessLicense.url);
    }
    if (!isEncrypted(this.businessLicense.public_id)) {
      this.businessLicense.public_id = encrypt(this.businessLicense.public_id);
    }
  }

  if (this.isModified("taxDocument")) {
    if (!isEncrypted(this.taxDocument.url)) {
      this.taxDocument.url = encrypt(this.taxDocument.url);
    }
    if (!isEncrypted(this.taxDocument.public_id)) {
      this.taxDocument.public_id = encrypt(this.taxDocument.public_id);
    }
  }

  next();
});

// Static method to decrypt bank information
merchantSchema.methods.decryptBankInfo = function () {
  return {
    bankInformation: {
      branchCode: decrypt(this.bankInformation.branchCode),
      accountType: decrypt(this.bankInformation.accountType),
      accountHolder: decrypt(this.bankInformation.accountHolder),
      bankName: decrypt(this.bankInformation.bankName),
      branchName: decrypt(this.bankInformation.branchName),
      accountNumber: decrypt(this.bankInformation.accountNumber),
    },
    document : {
      govId: {
        url : decrypt(this.govId.url),
        public_id : decrypt(this.govId.public_id),
      },
      businessLicense: {
        url : decrypt(this.businessLicense.url),
        public_id : decrypt(this.businessLicense.public_id),
      },
      taxDocument: {
        url: decrypt(this.taxDocument.url),
        public_id: decrypt(this.taxDocument.public_id),
      }
    }
  };
};

const Merchant = mongoose.model("Merchant", merchantSchema);

module.exports = Merchant;
