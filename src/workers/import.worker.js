
const { parentPort, workerData } = require("worker_threads");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Policy = require("../models/Policy.js");
const Agent = require("../models/Agent.js");
const UserAccount = require("../models/UserAccount.js");
const PolicyCategory = require("../models/PolicyCategory.js");
const PolicyCarrier = require("../models/PolicyCarrier.js");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const wb = xlsx.readFile(workerData.filePath);
    const sheet = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    const agentMap = {};
    const userAccountMap = {};
    const categoryMap = {};
    const carrierMap = {};

    // First pass: Create or get agents, accounts, categories, and carriers
    for (const row of sheet) {
      // Create or get Agent
      if (row.agent && !agentMap[row.agent]) {
        let agent = await Agent.findOne({ agentName: row.agent });
        if (!agent) {
          agent = await Agent.create({ agentName: row.agent });
        }
        agentMap[row.agent] = agent._id;
      }

      // Create or get UserAccount
      if (row.account_name && !userAccountMap[row.account_name]) {
        let account = await UserAccount.findOne({ accountName: row.account_name });
        if (!account) {
          account = await UserAccount.create({ accountName: row.account_name });
        }
        userAccountMap[row.account_name] = account._id;
      }

      // Create or get PolicyCategory
      if (row.category_name && !categoryMap[row.category_name]) {
        let category = await PolicyCategory.findOne({ categoryName: row.category_name });
        if (!category) {
          category = await PolicyCategory.create({ categoryName: row.category_name });
        }
        categoryMap[row.category_name] = category._id;
      }

      // Create or get PolicyCarrier
      if (row.company_name && !carrierMap[row.company_name]) {
        let carrier = await PolicyCarrier.findOne({ companyName: row.company_name });
        if (!carrier) {
          carrier = await PolicyCarrier.create({ companyName: row.company_name });
        }
        carrierMap[row.company_name] = carrier._id;
      }
    }

    // Second pass: Create users and policies
    for (const row of sheet) {
      // Create or get User
      let user = await User.findOne({ 
        firstName: row.firstname || row.account_name,
        email: row.email 
      });
      
      if (!user) {
        user = await User.create({
          firstName: row.firstname || row.account_name,
          dob: row.dob ? new Date(row.dob) : null,
          address: row.address,
          phone: row.phone,
          state: row.state,
          zip: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType || row.account_type
        });
      }

      // Create Policy
      await Policy.create({
        policyNumber: row.policy_number,
        startDate: row.policy_start_date ? new Date(row.policy_start_date) : null,
        endDate: row.policy_end_date ? new Date(row.policy_end_date) : null,
        user: user._id,
        category: categoryMap[row.category_name],
        carrier: carrierMap[row.company_name],
        agent: agentMap[row.agent],
        account: userAccountMap[row.account_name]
      });
    }

    parentPort.postMessage({ status: "Upload completed", message: "All data imported successfully" });
  } catch (error) {
    parentPort.postMessage({ status: "Error", message: error.message });
  } finally {
    await mongoose.connection.close();
  }
})();
