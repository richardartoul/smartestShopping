var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var fs = require('fs');

var db = mongoose.connect('mongodb://localhost:27017/savagetadpole');

var productSchema = new Schema({
  name: String,
  cost: String,
  category: String
});

var Product = db.model('product', productSchema);
var total_products = 0;
var finish = function(index) {
  if (index === total_products - 1) {
    // count products
    Product.count({}, function (err, count){
      if (err) throw err;
      console.log('Total products ', count);
    });
  };
  return;
};

//read the files and input into the database
fs.readFile('categories/produce.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;
  var products = JSON.parse(data);
  total_products = products.length;
  for (var index = 0, size = products.length; index < products.length; index++){
    var product = products[index];
    (function (product, index){
      Product.findOne(product, function (err, product_result){
        if (err) throw err;
        if (!product_result) {
          Product.create(product, function (err, success){
            if (err) throw err;
            if (success) {
              console.log('Add item ', product.name);
              finish(index);
            }
          });
        }else{
          finish(index);
        }
      });
    })(product, index);
  }
});