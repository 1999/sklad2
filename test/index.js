const { exec } = require('child_process');
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static')

// Serve up public/ftp folder
const serve = serveStatic(`${__dirname}/..`, {
  extensions: ['js'],
  index: ['index.html', 'index.js']
});

const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

server.listen(8080, () => {
  exec('open http://localhost:8080/test/');
});
