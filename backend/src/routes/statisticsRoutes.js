const express = require('express');
const jwtToken = require('../../middlewares/jwtToken');
const router = express.Router();
const {getDashboardStatistics} = require("../controllers/statisticsController.js")


// Route to get a shop by ID
router.get('/:chunkType', jwtToken, getDashboardStatistics);

module.exports = router;
