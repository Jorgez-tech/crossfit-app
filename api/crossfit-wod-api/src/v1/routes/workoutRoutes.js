// In src/v1/routes/workoutRoutes.js
const express = require("express");
const workoutController = require("../../controllers/workoutController");
// *** ADD ***
const recordController = require("../../controllers/recordController");
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const validationMiddleware = require('../../middleware/validationMiddleware');
const { createWorkoutSchema, updateWorkoutSchema, paramsSchema } = require('../../validation/workoutSchemas');

const router = express.Router();

router.get("/", workoutController.getAllWorkouts);

router.get("/:workoutId", validationMiddleware(paramsSchema, 'params'), workoutController.getOneWorkout);

// *** ADD ***
router.get(
    "/:workoutId/records",
    validationMiddleware(paramsSchema, 'params'),
    recordController.getRecordForWorkout
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware('entrenador'),
    validationMiddleware(createWorkoutSchema),
    workoutController.createNewWorkout
);

router.patch(
    "/:workoutId",
    authMiddleware,
    roleMiddleware('entrenador'),
    validationMiddleware(paramsSchema, 'params'),
    validationMiddleware(updateWorkoutSchema),
    workoutController.updateOneWorkout
);

router.delete(
    "/:workoutId",
    authMiddleware,
    roleMiddleware('entrenador'),
    validationMiddleware(paramsSchema, 'params'),
    workoutController.deleteOneWorkout
);

module.exports = router;
