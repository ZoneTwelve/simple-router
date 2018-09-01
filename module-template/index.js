var http = require('http');
var app = require('./simple-router/core');

app.setBoard(__dirname, 'view');
app.set((req, res, next)=>{
    console.log(req.method, req.url);
    next();
})

var index = require('./route/index');
var msg = require('./route/helloworld');

app.use('/', index);
app.use('/msg', msg);

http.createServer(app.core).listen(3000);
