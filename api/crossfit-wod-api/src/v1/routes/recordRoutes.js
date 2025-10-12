const express = require("express");
const recordController = require("../../controllers/recordController");
const validationMiddleware = require('../../middleware/validationMiddleware');
const { createRecordSchema, updateRecordSchema, recordParamsSchema } = require('../../validation/recordSchemas');

const router = express.Router();

router.get("/", recordController.getAllRecords);
router.get("/:recordId", validationMiddleware(recordParamsSchema, 'params'), recordController.getOneRecord);
router.post("/", validationMiddleware(createRecordSchema), recordController.createNewRecord);
router.patch(
    "/:recordId",
    validationMiddleware(recordParamsSchema, 'params'),
    validationMiddleware(updateRecordSchema),
    recordController.updateOneRecord
);
router.delete(
    "/:recordId",
    validationMiddleware(recordParamsSchema, 'params'),
    recordController.deleteOneRecord
);

module.exports = router;