const { User } = require('../models');

const userController = {

  // GET all users  
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // GET SINGLE user
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // POST user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // PUT user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
        { _id: params.id }, 
        body, 
        { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // DELETE user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // POST friend
  addFriend({params}, res) {
    User.findOneAndUpdate(
      {_id: params.id}, 
      {$push: { friends: params.friendId}}, 
      {new: true}
    )
      .populate({
        path: 'friends', 
        select: ('-__v')
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({message: 'No user found with this id!'});
          return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  // DELETE friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id},
      { $pull: { friends: params.friendId}},
      { new: true }
    )
      .populate({ 
        path: 'friends', 
        select: ('-__v')
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!"})
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = userController;