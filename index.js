var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonData = require('./test_data.json');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');

//////////// 
// Routes //
////////////

// Add score key to JSON and reset score when rendering homepage
app.get('/', resetScore, function(req, res) {
  res.render('index.ejs');
});

// Add score based on search inputs
app.post('/ranking', addScore, function(req, res){
  res.redirect('/result');
});

// Sort JSON based on score
app.get('/result', sortJson, function(req, res) {
  res.render('result.ejs', {data: jsonData});
});


///////////////////
//// Functions ////
///////////////////
function resetScore(req, res, next) {
  for( var i = 0; i < jsonData.length; i++) {
    jsonData[i].score = 0;
  }
  next();
}

function addScore(req, res, next) {
  var provider = req.body.provider;
  var country = req.body.country;
  var price = req.body.price;
  var ratings = req.body.ratings;
  var category = req.body.category;

  for( var i = 0; i < jsonData.length; i++) {
    if (jsonData[i].provider == provider) {
      jsonData[i].score++;
    }
    if (jsonData[i].country == country) {
      jsonData[i].score++;
    }
    if (jsonData[i].price_cents == price) {
      jsonData[i].score++;
    }
    if (jsonData[i].ratings == ratings) {
      jsonData[i].score++;
    }
    if (jsonData[i].category_title == category) {
      jsonData[i].score++;
    }
  }
  next();
}

function sortJson(req, res, next) {
  jsonData = jsonData.sort(function(a,b){
    if (b.score > a.score) {
      return 1;
    } else if (b.score < a.score) {
      return -1;
    } else {
      if (a.name > b.name && a.score > 0 && b.score > 0) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    }
  });
  next();
}

app.listen(3000, function(){
  console.log('Successfuly Connected to port 3000');
});
