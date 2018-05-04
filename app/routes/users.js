const Controller = require('./controller');
const db = require('../db');

const fields = ['email', 'firstName', 'lastName', 'password', 'id', 'sid'];

class User extends Controller {
  constructor(name) {
    super(name);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  async create(ctx, next) {
    const user = await this.findByField('email', ctx.request.body.email);

    if (user) {
      ctx.status = 403;
      ctx.body = { error: 'Not unique email' };
    } else {
      this.clearUser(ctx.request.body);
      await super.create(ctx, next);
    }
  }

  async update(ctx, next) {
    const updatedUser = ctx.request.body;
    const users = await this.getValue();
    const user = users.find(usr => usr.email === updatedUser.email);

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'There is no user with such email' };
      return;
    }

    delete updatedUser.email;

    if (!updatedUser.password) {
      delete updatedUser.password;
    }

    this.clearUser(updatedUser);

    Object.assign(user, updatedUser);

    const response = { ...user };
    delete response.sid;
    delete response.password;
    ctx.body = await db.write(this.name, users, response);

    await next();
  }

  clearUser(user = {}) {
    Object.keys(user).forEach((key) => {
      if (fields.indexOf(key) === -1) {
        delete user[key];
      }
    });
  }
}

module.exports = new User('users');
