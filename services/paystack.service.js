const axios = require('axios');

class PaystackService {
    constructor() {
    this.baseURL = 'https://api.paystack.co';
    this.secretKey = process.env.PAYSTACK_SECRET_KEY; // YOUR master Paystack secret key
    this.testSecretKey = process.env.PAYSTACK_TEST_SECRET_KEY;
  }
  getHeaders(isTest = false) {
    const key = isTest ? this.testSecretKey : this.secretKey;
    return {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    };
  }
  async verifyBankAccount(accountNumber, bankCode) {
    try {
      const response = await axios.get(
        `${this.baseURL}/bank/resolve`,
        {
          params: {
            account_number: accountNumber,
            bank_code: bankCode,
          },
          headers: this.getHeaders(),
        }
      );

      if (response.data.status) {
        return {
          success: true,
          data: response.data.data,
          accountName: response.data.data.account_name,
          accountNumber: response.data.data.account_number,
        };
      }

      return {
        success: false,
        message: response.data.message || 'Bank account verification failed',
      };
    } catch (error) {
      console.error('Bank verification error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify bank account',
        error: error.response?.data || error.message,
      };
    }
  }
}

module.exports = new PaystackService();
