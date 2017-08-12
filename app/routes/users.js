const db = require('../db/');
const users = db.get('users');

module.exports = {
  get(ctx) {
    ctx.body = users;
  },

  getById(ctx, id) {
    const user = users.find(user => user.id == id);

    if (!user) {
      return ctx.throw('cannot find that user', 404);
    }

    ctx.body = user;
  },

  async create(ctx, next) {
    const newUser = ctx.request.body;
    newUser.id = users.length + 1;
    users.push(newUser);

    ctx.body = await db.write('users', users, newUser);

    await next();
  }
};
