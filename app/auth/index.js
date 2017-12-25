const session = require('koa-session2');
const passport = require('koa-passport');
const route = require('koa-route');
const Store = require('./store');
const db = require('../db');

const store = new Store();

const initPassport = (app) => {
  app.keys = ['secret'];
  app.use(session({
    key: 'ECSID',
    maxAge: 24 * 60 * 60 * 1000,
    saveUninitialized: true,
    resave: true,
    store,
  }));

  require('./auth');
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(route.post('/public/login', (ctx) => {
    return passport.authenticate('local', (err, user) => {
      if (!user) {
        ctx.body = { user: false };
        ctx.throw(401, 'Password or email wrong');
      } else {
        ctx.body = { ...user };
        return ctx.login(user);
      }
    })(ctx);
  }));

  app.use(route.get('/public/checkUser', async (ctx) => {
    const cookie = ctx.cookies.get('ECSID');

    try {
      const users = await db.get('users');
      const user = users.find(item => item.sid && cookie === item.sid);

      if (user) {
        delete user.sid;
        delete user.password;
        ctx.body = user;
      } else {
        ctx.status = 404;
        ctx.body = { error: 'User is not authenticated' };
      }
    } catch (e) {
      console.log('Error get user', e);
    }
  }));

  app.use(route.get('/logout', async (ctx) => {
    store.destroy(ctx.cookies.get('ECSID'));
    ctx.logout();
    ctx.status = 204;
  }));

  app.use(async (ctx, next) => {
    const publicPath = ctx.url.includes('public') || ctx.url === '/';

    if (publicPath || ctx.isAuthenticated()) {
      await next();
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
  });
};

module.exports = initPassport;
