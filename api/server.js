const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = server.router('cities.json');
const middleware = jsonServer.defaults();

server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://your-frontend-domain.vercel.app',
    ],
    credentials: true,
  })
);

server.use(middleware);
server.use('/api', router);

const port = process.env.PORT || '8000';
server.listen(port, () => {
  console.log(`JSON server is running on port ${port}`);
});
