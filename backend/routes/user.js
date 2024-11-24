const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createUser); 
router.post('/login', login); 
router.get('/', authMiddleware, getAllUsers); 
router.get('/:id', authMiddleware, getUserById
router.put('/:id', authMiddleware, updateUser); 
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
