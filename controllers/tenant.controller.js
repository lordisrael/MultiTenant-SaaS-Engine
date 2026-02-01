const expressAsyncHandler = require('express-async-handler');
const StatusCodes = require('http-status-codes');
const Tenant = require('../models/tenant.model');


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

})