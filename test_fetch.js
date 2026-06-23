const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/configurators/1/sync-products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// not going to work without laravel running.
