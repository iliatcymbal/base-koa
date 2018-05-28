const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const serve = require('koa-static');

const auth = require('./auth');
const routing = require('./routing');

const pathToStatic = path.resolve(__dirname, '..', 'static');

const app = new Koa();
app.use(logger());
app.use(cors({
  credentials: true,
}));
app.use(bodyParser());

app.use(serve(pathToStatic));
auth(app);

routing(app);

app.listen(8081);
console.log('Check http://localhost:8081');
