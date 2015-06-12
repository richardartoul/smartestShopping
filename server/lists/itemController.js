var Q = require('q');
var request = require('request');
var config = require('./config.js');
var mongoose = require('mongoose');
var models = require('../../db/database.js');
var Item = mongoose.model('Item', models.item);

var mode = function(array) {
  var count = {};
  var maxCount = 0;
  var max;
  for (var i = 0; i < array.length; i++) {
    count[array[i]] = (count[array[i]] || 0) + 1;
    if (count[array[i]] > maxCount) {
      maxCount = count[array[i]];
      max = array[i];
    }
  }
  return max;
};

module.exports = {

  createNewItem: function(req, res, next) {
    // console.log('name', name);
    var search = req.body;
    var findItem = Q.nbind(Item.findOne, Item);
    // var createItem = Q.nbind(Item.create, Item);

    findItem(search)
    .then(function(match) {
      if (match) {
        req.smartShoppingData = match;
        next();
      } else {
        res.status(404).send({error: 'Item didnt found'});
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send({error: 'Server Error'});
    });
  },

  autocomplete: function (req, res, next) {
    var itemName = req.params.name;
    Item.find({name: new RegExp(itemName, "i")}).sort({'name': 1}).limit(15).exec(function (err, results) {
      if (err) {
        res.status(500).send({error: 'Server Error'});
      }else {
        res.status(200).json(results);
      }
    });
  }
}





