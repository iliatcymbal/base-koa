const Controller = require('./controller');

class User extends Controller {
  constructor(name) {
    super(name);
    this.create = this.create.bind(this);
  }

  async create(ctx, next) {
    console.log(ctx.req.file);
    ctx.body = { uploaded: true };

    await next();
  }
}

module.exports = new User('users');
