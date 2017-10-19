const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');

const routing = require('./routing');

const app = new Koa();
app.use(cors());

const route = routing(app);

app.use(bodyParser());

app.keys = ['secret'];
app.use(session({}, app));

require('./auth');
app.use(passport.initialize());
app.use(passport.session());

//app.use(koaBody());

app.use(route.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
));

app.listen(8081);
console.log('listening on port 8081');
