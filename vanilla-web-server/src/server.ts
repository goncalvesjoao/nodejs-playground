import http, { IncomingMessage, Server, ServerResponse } from "node:http";

export function requestListener(_request: IncomingMessage, response: ServerResponse): void {
  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ status: "ok" }));
}

export function createServer(): Server {
  return http.createServer(requestListener);
}

export function startServer(port = 3000): Server {
  const server = createServer();

  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  return server;
}
