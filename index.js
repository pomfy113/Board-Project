// Set-up
const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render("home");
});

// View Engine - Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Porting
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
