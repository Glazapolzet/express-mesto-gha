const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateProfileInfo, updateProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateProfileAvatar);

module.exports = router;
