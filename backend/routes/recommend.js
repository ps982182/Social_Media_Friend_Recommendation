// backend/routes/recommend.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('friends');
  if (!user) return res.status(404).send('User not found');

  // Build graph
  const allUsers = await User.find({});
  const graph = {};
  allUsers.forEach(u => {
    graph[u._id] = u.friends.map(f => f.toString());
  });

  // Mutual friends recommendation
  const userFriends = user.friends.map(f => f._id.toString());
  const recommendations = {};

  userFriends.forEach(friendId => {
    graph[friendId].forEach(mutualId => {
      if (
        mutualId !== user._id.toString() &&
        !userFriends.includes(mutualId)
      ) {
        recommendations[mutualId] = (recommendations[mutualId] || 0) + 1;
      }
    });
  });

  // Sort by mutual friends count
  const sorted = Object.entries(recommendations)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, mutualFriends: count }));

  const users = await User.find({ _id: { $in: sorted.map(r => r.id) } });
  const result = users.map(u => ({
    _id: u._id,
    name: u.name,
    profilePic: u.profilePic,
    mutualFriends: sorted.find(r => r.id === u._id.toString()).mutualFriends
  }));

  res.json(result);
});

module.exports = router;
