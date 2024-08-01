const express = require('express');
const { 
  register, login, updateProfile, 
  forgotPassword, resetPassword, 
  changePassword, deleteUser, getUserById, 
  listUsers, verifyEmail 
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authmiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Profile routes
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ message: 'This is a protected route', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

router.put('/profile', authMiddleware, updateProfile); // Update profile
router.put('/change-password', authMiddleware, changePassword); // Change password
router.delete('/profile', authMiddleware, deleteUser); // Delete account

router.post('/forgot-password', forgotPassword); // Forgot password
router.post('/reset-password', resetPassword); // Reset password

router.get('/users/:id', authMiddleware, getUserById); // Get user by ID (admin use)
router.get('/users', authMiddleware, listUsers); // List users (admin use)
router.get('/verify-email', verifyEmail); // Verify email

module.exports = router;
