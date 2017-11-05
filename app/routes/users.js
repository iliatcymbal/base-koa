const Controller = require('./controller');

class User extends Controller {
    async create(ctx, next) {
        const user = await this.findByField('email', ctx.request.body.email);

        if (user) {
            ctx.status = 403;
            ctx.body = { error: 'Not unique email' };
        } else {
            await super.create(ctx, next);
        }
    }
}

module.exports = new User('users');
