const Controller = require('./controller');
const db  = require('../db');

class Tasks extends Controller {
  constructor(name) {
    super(name);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
  }

  async get(ctx) {
    const items = await this.getValue();

    items.forEach(item => item.forEach(data => delete data.description));
    ctx.body = items;
  }

  async getById(ctx) {
    const days = await this.getValue();
    const id = ctx.params.id;
    const item = days
      .reduce((acc, items) => [...acc, ...items], [])
      .find(item => String(item.id) === String(id));

    if (!item) {
      return ctx.throw('cannot find requested task', 404);
    }

    ctx.body = item;
  }

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
      id: `${day}${tasks.length}`
    };

    tasks.push(newTask);

    ctx.body = await db.write(this.name, days, newTask);

    await next();
  }

  async update(ctx, next) {console.log('-->', ctx.params);
    const data = ctx.request.body;
    const id = ctx.params.id;
    const { day, title, description } = data;

    if (day === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'Day should be defined' };
      return;
    }

    if (id === undefined) {
      ctx.status = 400;
      ctx.body = { error: 'ID should be defined' };
      return;
    }

    if (!title) {
      ctx.status = 400;
      ctx.body = { error: 'Title should be defined' };
      return;
    }

    const days = await this.getValue();
    const tasks = days[day];
    const task = tasks.find(item => String(item.id) === String(id));

    if (task) {
      task.title = title;
      task.description = description;
    }

    await db.write(this.name, days, task);
    ctx.body = task;

    await next();
  }
}

module.exports = new Tasks('tasks');
