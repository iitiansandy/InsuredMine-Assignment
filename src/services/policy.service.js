const Policy = require("../models/Policy.js");
const User = require("../models/User.js");

const searchByUsername = async (userName) => {
  try {
    const user = await User.findOne({ firstName: userName });
    if (!user) return [];
    const policies = await Policy.find({ user: user._id }).populate("user category carrier agent account");
    return policies;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const aggregateByUser = async (req, res) => {
  try {
    const data = await Policy.aggregate([
      { $group: { _id: "$user", totalPolicies: { $sum: 1 } } }
    ]);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = { searchByUsername, aggregateByUser };