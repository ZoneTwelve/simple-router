# simple-router:
## API: const app = require('core');
### app.core:
1. request(function prototype)
    (http module's createServer function request)
2. response(function prototype)
    (http module's createServer function response)
    
### app.use
1. path(string)
    request uri
2. route(function)
    http module's createServer request and response procedure

### app.set
1. func(function)
    middleware function

### app.setBoard
1. path(string)
    path, ex:`${__dirname}`
2. folder(string)
    ex: 'view'

### app.setPublic
1. path(string)
    just path, ex: `${__dirname}`
2. folder(string)
    path+target-folder, ex: 'public'
