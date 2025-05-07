const express = require("express");
const {
  getUsers,
  getSellers,
  getMedicines,
  getRevenue,
  putUsers,
  getOut,
  getOrders,
  getLatest,
  getMonthlyRevenue,
  postUsers,
  deleteUsers,
} = require("../controllers/Controller");
const router = express.Router();

router.route("/users").get(getUsers).post(postUsers);
router.route("/users/:id").put(putUsers).delete(deleteUsers);
router.route("/user").get(getLatest);
router.route("/sellers").get(getSellers);
router.route("/medicine").get(getMedicines);
router.route("/medicines").get(getOut);
router.route("/order").get(getOrders);
router.route("/orders").get(getRevenue);
router.route("/monthly-revenue").get(getMonthlyRevenue);

module.exports = router;