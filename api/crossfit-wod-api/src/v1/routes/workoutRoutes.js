// In src/v1/routes/workoutRoutes.js
const express = require("express");
const workoutController = require("../../controllers/workoutController");
// *** ADD ***
const recordController = require("../../controllers/recordController");
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

const router = express.Router();

router.get("/", workoutController.getAllWorkouts);

router.get("/:workoutId", workoutController.getOneWorkout);

// *** ADD ***
router.get("/:workoutId/records", recordController.getRecordForWorkout);

router.post("/", authMiddleware, roleMiddleware('entrenador'), workoutController.createNewWorkout);

router.patch("/:workoutId", authMiddleware, roleMiddleware('entrenador'), workoutController.updateOneWorkout);

router.delete("/:workoutId", authMiddleware, roleMiddleware('entrenador'), workoutController.deleteOneWorkout);

module.exports = router;
