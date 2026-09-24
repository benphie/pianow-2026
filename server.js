const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServer)) {
  require(standaloneServer);
} else {
  const next = require('next');
  const http = require('http');

  const app = next({
    dev: false,
    hostname: process.env.HOSTNAME,
    port: parseInt(process.env.PORT, 10),
  });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(process.env.PORT, process.env.HOSTNAME, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${process.env.HOSTNAME}:${process.env.PORT}`);
    });
  });
}
