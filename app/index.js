const _ = require('koa-route');
const Koa = require('koa');
const cors = require('kcors');
const app = new Koa();

app.use(cors());

const {users} = require('./routes');

app.use(_.get('/users', users.get));
app.use(_.get('/users/:id', users.getById));

app.listen(8081);
console.log('listening on port 8081');
