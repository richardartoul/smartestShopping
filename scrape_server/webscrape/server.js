var fs = require('fs');
var phantom = require('phantom');

var container = []; //stores the data for to be written into json.
var urlStore = []; //stores url for every sub category
var currentCategory;
var currentSubCategory;
var categories = {};
var subCategories = {};
//cat
var catCounter = 0;
var catNameArray = [];
var catUrlArray = [];
//subcat

var url;
var initialUrl = 'https://fresh.amazon.com/?&browseMP=A3FX2TOAMS7SFL';
var categoryUrl;

phantom.create(function (ph) {

  var recurseCategory = function() {
    var doc = ph.createPage(function (page) {
      page.set('viewportSize', {width:1200,height:1920});
      page.open(url, function (status) {
        console.log('scraping page opened ', status, '  ', url);
          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
            if(url) {
              page.evaluate(function () {
                var items = [];
                  $('.resultSet .itemDetails').each(function() {
                    var obj = {
                      name: $(this).find('.title a').text().split('').splice(0, $(this).find('.title a').text().indexOf(',')).join(''),
                      cost: $(this).find('.price .value').text().replace(/\s/g, ''),
                      image: $(this).find('.itemDetailImage').attr('src'),
                      category: null
                    };
                    items.push(obj);
                  });
                  items.push($('.pagination a').last().attr('href').split('').splice(0, $('.pagination a').last().attr('href').length - 2).join('') + '100&browseMP=A3FX2TOAMS7SFL');

              return items;

              }, function(response) {
                for(var i in response) {
                  response[i].category = currentCategory;
                }
                if(urlStore.indexOf(response[response.length-1]) >= 0) {
                  response.pop();
                  container = container.concat(response);
                  //doesn't account for no sub cats.
                  fs.writeFile('./realdata/' + currentCategory + '.json', JSON.stringify(container), function(err){
                    if(err) {
                      console.log(err);
                      return;
                    }
                      console.log('wrote for ' + currentCategory);
                      callBack();
                      container = [];
                      page.close();
                  });
                }
                else {
                  urlStore.push(categoryUrl);
                  categoryUrl = response.pop();
                  console.log(categoryUrl);
                  container = container.concat(response);
                  page.close(); 
                  recurseCategory();
                }
              });
            }
          }); 
      });
    });
  };
  
  var findCategories = function() {
    ph.createPage(function(page) {
      page.set('viewportSize', {width:1200,height:1920});
        page.open(initialUrl, function(status) {
        console.log('Main Page opened: ', status);
        page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
          page.evaluate(function() {
            var categories = {};
            $('.cat-tile-with-subcats .cat-list-name a').each(function() {
              categories[$(this).text().split('').splice(0, $(this).text().length - 2).join('').replace(/\s/g, '')] = $(this).attr('href');
            }); 
            return categories;
          }, function(response) {
              categories = response;
              for (var category in categories) {
                catNameArray.push(category);
                catUrlArray.push('https://fresh.amazon.com' + categories[category] + '&browseMP=A3FX2TOAMS7SFL');
              }
              iterateFunction(catNameArray[catCounter], catUrlArray[catCounter]);
          }); 
        });
      }); 
    });
  };

  var categorySub = function() {
    ph.createPage(function(page) {
      page.set('viewportSize', {width:1200,height:1920});
          page.open(categoryUrl, function(status) {
          console.log('Sub Page opened: ', status);
          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
            page.evaluate(function() {
              var subCategories = {};
              $('.cat-tile-with-subcats .cat-list-name a').each(function() {
                subCategories[$(this).text().split('').splice(0, $(this).text().length - 2).join('').replace(/\s/g, '')] = $(this).attr('href');
              }); 
              return subCategories;
            }, function(response) {
              subCategories = response;
              console.log(response);
              for(var subCategory in subCategories) {
                  subCatNameArray.push(subCategory);
                  subCatUrlArray.push('https://fresh.amazon.com' + subCategories[subCategory] + '&browseMP=A3FX2TOAMS7SFL');
              }
              while(excludeSubCategory.indexOf(subCatNameArray[subCatCounter]) > -1) {
                subCatCounter++;
              }
              iterateFunction2(subCatNameArray[subCatCounter], subCatUrlArray[subCatCounter]);
              
             }); 
            });
          });
    });
  };
  //currently changed to call recursecategory
  var iterateFunction = function(categoryName, categoryURL) {
    console.log(categoryName, categoryUrl);
    if (catCounter < catUrlArray.length) {
      currentCategory = categoryName;
      categoryUrl = categoryURL;
      console.log('on category: ', categoryName);
      console.log(categoryUrl);
      categorySub();
    }
  };


  var iterateFunction2 = function(subCategoryName, subCategoryUrl, callback) {
    if (subCatCounter < subCatUrlArray.length) {

      currentSubCategory = subCategoryName;
      url = 'https://fresh.amazon.com' + subCategories[subCategoryName] + '&browseMP=A3FX2TOAMS7SFL';
      console.log('on sub-category: ', subCategoryName);
      console.log(url);

      recurseCategory();
    }
    else {
      subCatCounter = 0;
      catCounter++;
      console.log(catCounter);
      iterateFunction(catNameArray[catCounter], catUrlArray[catCounter]);
    }
  };

  var callBack = function () {
    catCounter++;
    iterateFunction(catNameArray[catCounter], catUrlArray[catCounter]);
  };


  findCategories();
});



