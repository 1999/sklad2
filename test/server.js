const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const serve = serveStatic(`${__dirname}/..`, {
  extensions: ['js'],
  index: ['index.html', 'index.js'],
});

const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

server.listen(8080, () => console.log('Server listening on :8080'));
