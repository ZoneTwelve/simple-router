module.exports = function(req, res){
  if(req.query.key!=='admin'){
    res.present('index-403', 403);
  }else{
    res.send(`<h1>welcome</h1><a href="/msg">read message</a>`);
  }
}
