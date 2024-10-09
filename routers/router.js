const express = require("express");
const authenticateJWT = require("../middlewares/authorize");
const { registerUser, loginUser, returnAdmins } = require("../controllers/authController");
const { rejectAssignment, acceptAssignment, returnTaggedAssignment, uploadAssignment } = require("../controllers/assignmentController");

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/upload', authenticateJWT, uploadAssignment)
router.get('/admins', returnAdmins)
router.post('/assignments', authenticateJWT, returnTaggedAssignment)
router.post('/assignments/:id/accept', authenticateJWT, acceptAssignment)
router.post('/assignments/:id/reject', authenticateJWT, rejectAssignment)

module.exports = router;