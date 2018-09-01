const qs = require('querystring');
const url = require('url');

const fs = require('fs');

const defmw = [send, present];

var routeRequest = [];
var middlewareRequest = [];

var publicPath = null;
var boardPath = null;

function core(req, res){
  var q = url.parse(req.url, true);
  req.query = q.query;
  req.pathname = q.pathname;

  var body = '';
  req.on('data', function (data) {
    body += data;
    if(body.length>1e6)
      req.connection.destroy();
  });

  req.on('end', function(){
    req.post = qs.parse(body);
    defaultMiddleware(req, res);
  });
}

function defaultMiddleware(req, res, index = 0){
  if(index<defmw.length){
    return defmw[index](req, res, ()=>{
      return defaultMiddleware(req, res, index+1);
    });
  }else{
    return middleware(req, res);
  }
}

function middleware(req, res, index = 0){
  if(index<middlewareRequest.length){
    return middlewareRequest[index](req, res, ()=>{
      return middleware(req, res, index+1);
    });
  }else{
    return request(req, res);
  }
}

function request(req, res){
  var routeFunc = routeRequest[req.pathname.toLowerCase()];
  if(routeFunc===undefined&&publicPath==null){
    return sendNotfound(res);
  }else if(routeFunc!==undefined){
    return routeFunc(req, res);
  }else if(publicPath!==null){
    return readFromPublic(req, res);
  }
}

function readFromPublic(req, res){
  if(publicPath==null)
    return sendNotfound(res);
  var target = publicPath+req.pathname;
  return fs.readFile(target, function (err, buffer) {
    if(err){
      return sendNotfound(res);
    }else{
      return res.send(buffer);
    }
  });
}

function setBoard(path, folder){
  boardPath = `${path}/${folder}`;
}

function setPublic(path, folder){
  publicPath = `${path}/${folder}`;
}

function use(path, func){
  routeRequest[path] = func;
}

function set(func){
  middlewareRequest.push(func);
}

function sendNotfound(res){
  res.send('404 not found', 404);
}

//default middleware
function send(req, res, next){
  res.send = (content = '', status = 200) => {
    res.writeHead(status, {'Content-Type':'text/html'});
    res.end(content);
  };
  next();
}

function present(req, res, next){
  res.present =  (file = '', status) => {
    console.log(`${boardPath}/${file}.html`);
    if(boardPath!=null&&file!=''){
      var target = `${boardPath}/${file}.html`;
      return fs.readFile(target, function (err, buffer) {
        if(err){
          res.send("404 not found", 404);
        }else{
          res.send(buffer, status||200);
        }
      });
    }else{
      console.error("boardPath not found");
      return res.send("Server side error", 503);
    }  
  }
  next();
}
//default middleware end

exports.use = use;
exports.set = set;
exports.core = core;
exports.setBoard = setBoard;
exports.setPublic = setPublic;
