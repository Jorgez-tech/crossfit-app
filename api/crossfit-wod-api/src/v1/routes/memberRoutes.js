const express = require("express");
const memberController = require("../../controllers/memberController");
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const validationMiddleware = require('../../middleware/validationMiddleware');
const { createMemberSchema, updateMemberSchema, paramsSchema } = require('../../validation/memberSchemas');

router.get("/", memberController.getAllMembers);
router.get("/:memberId", validationMiddleware(paramsSchema, 'params'), memberController.getOneMember);
router.post(
    "/",
    authMiddleware,
    roleMiddleware('entrenador'),
    validationMiddleware(createMemberSchema),
    memberController.createNewMember
);
router.patch(
    "/:memberId",
    authMiddleware,
    roleMiddleware('entrenador'),
    validationMiddleware(paramsSchema, 'params'),
    validationMiddleware(updateMemberSchema),
    memberController.updateOneMember
);
router.delete(
    "/:memberId",
    authMiddleware,
    roleMiddleware('entrenador'),
    validationMiddleware(paramsSchema, 'params'),
    memberController.deleteOneMember
);

module.exports = router;