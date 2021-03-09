const express = require('express');
const app = express();
const port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"));

app.get("/", function(req, res){
  res.render("index");
})

app.listen(port, function(){
  console.log("Port: 5000")
})