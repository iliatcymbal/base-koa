#  Add new route  

If you need another endpoint, for instance _http://localhost:8081/public/names_, you should create new route for it.  
To add new route (e.g. "names") follow next steps:  

1) In _app/db_ create new json file (e.g. "names.json").
2) In _app/routes_ create new js file (e.g. "names.js").  
Create and export new Controller instance passing name of your json file:  
```
const Controller = require('./controller');
module.exports = new Controller('names');
```
You can extend controller according to your requirements:  
```
const Controller = require('./controller');
class Names extends Controller {...}
module.exports = new Names('names');
```
3) Open _app/routes/index.js_ and reexport created instance:
```
const names = require('./names');

module.exports = {
  ...
  names
};
```
4) Go to _app/routing.js_ and inside `module.exports` method add all routes you need:  
```
const { names } = require('./routes');
  _.get('/public/names', names.get);
  _.post('/public/names', names.create);
  _.put('/public/names', names.update);

```
  
You need `/public` path to use route without authentication.  
Check _app/routes/controller.js_ to find out default methods you can use.
