var Q = require('q');
var request = require('request');
var mongoose = require('mongoose');
var models = require('../../db/database.js');
// var Item = mongoose.model('Item', models.item);
var User = mongoose.model('User', models.user);


module.exports = {


  updateBudget: function(req, res){ //sets the current budget to amount on current user
    var username = req.uid;
    var newBudget = req.body.name;

    var setModifier = {$set: {}};
    setModifier.$set['budget'] = newBudget;
    User.findOneAndUpdate({username: username}, setModifier, {upsert: true}, function(err,user){
      if(err) {
        console.error(err);
        res.status(500).send({error: 'Server Error'});
      } else {
        console.log("seems all working here ");
        res.send('done');
      }
    });
  },

  setBalance: function(balance){ // resets the current Balance to value if present or Budget amount on current user

  }


}


