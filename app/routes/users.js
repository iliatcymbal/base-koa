const users = require('../db/users.json');

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
  }
};
