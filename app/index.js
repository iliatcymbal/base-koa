const _ = require('koa-route');
const Koa = require('koa');
const cors = require('kcors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(koaBody());
app.use(cors());

const {users} = require('./routes');

app.use(_.get('/users', users.get));
app.use(_.get('/users/:id', users.getById));
app.use(_.post('/user', users.create));

app.listen(8081);
console.log('listening on port 8081');
