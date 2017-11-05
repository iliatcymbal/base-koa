const {Store} = require("koa-session2");
const db = require('../db');

class LocalStore extends Store {
  async get(sid, ctx) {
    const users = await db.get('users');
    const user = users.find(user => user.sid === sid);

    return JSON.parse(this.sessions.get(sid) || '{}');
  }

  async set(session, {sid = this.getID(24), maxAge = 1000000} = {}, ctx) {
    this.sessions.set(sid, JSON.stringify(session));

    try {
      const users = await db.get('users');
      const user = users.find(item => session.passport && item.id === session.passport.user);

      user.sid = sid;
      await db.write('users', users, user);
    } catch (e) {
      console.log('Error set users', e);
    }

    return sid;
  }

  async destroy(sid) {
    try {
      const users = await db.get('users');
      const user = users.find(item => item.sid === sid);

      delete user.sid;
      await db.write('users', users, user);
    } catch (e) {
      console.log('Error remove sid user', e);
    }

    super.destroy(sid);
  }
}

module.exports = LocalStore;
