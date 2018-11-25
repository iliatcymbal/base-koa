const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const serve = require('koa-static');

const auth = require('./auth');
const routing = require('./routing');

const pathToStatic = path.resolve(__dirname, '..', 'static');
const pathToFiles = path.resolve(__dirname, 'files');

const PORT = 8086;

const app = new Koa();
app.use(logger());
app.use(cors({
  credentials: true,
}));
app.use(bodyParser({ multipart: true }));

app.use(serve(pathToStatic));
app.use(serve(pathToFiles));

auth(app);

routing(app);

app.listen(PORT);
console.log(`Check http://localhost:${PORT}`);
