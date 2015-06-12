var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var fs = require('fs');
var models = require('../db/database.js');
var db = mongoose.connect('mongodb://localhost:27017/savagetadpole');

var Item = db.model('item', models.item);
var total_items = 0;
var finish = function(index) {
 if (index === total_items - 1) {
   // count products
   Item.count({}, function (err, count){
     if (err) throw err;
     console.log('Total items ', count);
   });
 };
 return;
};

//read the files and input into the database
fs.readFile('categories/produce.json', {encoding: 'utf8'}, function (err, data) {
 if (err) throw err;
 var items = JSON.parse(data);
 total_items = items.length;
 for (var index = 0, size = items.length; index < items.length; index++){
   var item = items[index];
   (function (item, index){
     if (item.cost) {
       item.price = item.cost;
       item.price = item.price.replace('$', '');
       if (item.price.indexOf('(')) {
         item.price.split('').splice(0, item.price.indexOf('(')).join('');
       }
       if (item.price.indexOf('/')) {
         item.price.split('').splice(0, item.price.indexOf('/')).join('');
       }
       item.price = parseFloat(item.price);
     }else {
       item.price = 0;      
     }
     Item.findOne(item, function (err, item_result){
       if (err) throw err;
       if (!item_result) {
         Item.create(item, function (err, success){
           if (err) throw err;
           if (success) {
             console.log('Add item ', item.name);
             finish(index);
           }
         });
       }else{
         finish(index);
       }
     });
   })(item, index);
 }
});