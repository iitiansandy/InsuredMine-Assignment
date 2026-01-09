
const PolicyService = require("../services/policy.service.js");

const searchByUsername = async (req, res) => {
  try {
    const { userName } = req.query;
    const policies = await PolicyService.searchByUsername(userName);
    if (policies.length === 0) return res.json([]);
    return res.json(policies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const aggregateByUser = async (req, res) => {
  try {
    const data = await PolicyService.aggregateByUser();
    if (data.length === 0) return res.json([]);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { searchByUsername, aggregateByUser };
