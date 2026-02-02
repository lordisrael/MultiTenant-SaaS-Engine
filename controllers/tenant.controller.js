const expressAsyncHandler = require('express-async-handler');
const StatusCodes = require('http-status-codes');
const Tenant = require('../models/tenant.model');
const paystackService = require("../services/paystack.service")


const createTenant = expressAsyncHandler(async (req, res) => {
    const {
        name,
        slug,
        billingEmail,
        supportEmail,
        contactPhone,
        bankAccount,
        commissionType,
    } = req.body;

    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
        res.status(StatusCodes.CONFLICT);
        throw new Error('Slug already exists');
    }

    const bankVerification = await paystackService.verifyBankAccount(
        bankAccount.accountNumber,
        bankAccount.bankCode
    );

    if (!bankVerification.success) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error(bankVerification.message || 'Bank account verification failed');
    }

    const verifiedAccountName = bankVerification.accountName.toLowerCase().trim();
    const providedAccountName = bankAccount.accountName.toLowerCase().trim();

    if (!verifiedAccountName.includes(providedAccountName.split(' ')[0])) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error(
            `Account name mismatch. Expected: ${bankVerification.accountName}, Got: ${bankAccount.accountName}`
        );
    }

})