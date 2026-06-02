const path = require('path');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.DB_PATH = path.join(__dirname, '..', 'test.db');
