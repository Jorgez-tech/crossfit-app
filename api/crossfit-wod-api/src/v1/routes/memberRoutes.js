const express = require("express");
const memberController = require("../../controllers/memberController");
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

router.get("/", memberController.getAllMembers);
router.get("/:memberId", memberController.getOneMember);
router.post("/", authMiddleware, roleMiddleware('entrenador'), memberController.createNewMember);
router.patch("/:memberId", authMiddleware, roleMiddleware('entrenador'), memberController.updateOneMember);
router.delete("/:memberId", authMiddleware, roleMiddleware('entrenador'), memberController.deleteOneMember);

module.exports = router;