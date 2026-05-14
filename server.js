import handler from 'serve-handler';
import http from 'http';

const server = http.createServer((req, res) =>
  handler(req, res, { public: 'dist' })
);

const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => console.log(`listening on :${port}`));
