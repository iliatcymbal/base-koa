const Controller = require('./controller');
const db = require('../db');

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

    Object.assign(user, updatedUser);

    const response = { ...user };
    delete response.sid;
    delete response.password;
    ctx.body = await db.write(this.name, users, response);

    await next();
  }
}

module.exports = new User('users');
