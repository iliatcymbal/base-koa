const Controller = require('./controller');
const db  = require('../db');

class Tasks extends Controller {
  async create(ctx, next) {
    const data = ctx.request.body;
    const { day, title } = data;

    if (day === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'Day should be defined' };
      return;
    }

    if (!title) {
      ctx.status = 400;
      ctx.body = { error: 'Title should be defined' };
      return;
    }

    const days = await this.getValue();
    const tasks = days[day];
    const newTask = {
      ...data,
      id: tasks.length
    };

    tasks.push(newTask);

    ctx.body = await db.write(this.name, days, newTask);

    await next();
  }
}

module.exports = new Tasks('tasks');
