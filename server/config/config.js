const {
  PORT = 8000,
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'secret!session',
  SESS_LIFETIME = 1000 * 60 * 60 * 2
} = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME
};