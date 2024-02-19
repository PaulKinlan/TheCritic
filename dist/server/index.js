// @ts-ignorefile
import { asRuntimeKit } from "@google-labs/breadboard";
import { HTTPServerTransport, ProxyServer, } from "@google-labs/breadboard/remote";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";
import { Core } from "@google-labs/core-kit";
import http from "http";
import path from "path";
import handler from "serve-handler";
const extractRequestBody = async (request) => {
    return new Promise((resolve, reject) => {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk.toString();
        });
        request.on("end", () => {
            resolve(JSON.parse(body));
        });
        request.on("error", reject);
    });
};
/*
  This is a simple implementation of a ResponseHandler for the HTTPServerProxyTransport. It maps http.ServerResponse on to an express-lie response object.
*/
class ResponseHandler {
    response;
    #response;
    constructor(response) {
        this.response = response;
        this.#response = response;
    }
    header(field, value) {
        this.#response.setHeader(field, value);
        return;
    }
    write(chunk) {
        return this.#response.write(chunk);
    }
    end() {
        this.#response.end();
    }
}
export const startServer = async (dist, port, config) => {
    const server = http.createServer(async (request, response) => {
        console.log(`${request.method}`);
        if (request.method === "POST") {
            const body = await extractRequestBody(request);
            const responseHandler = new ResponseHandler(response);
            const server = new ProxyServer(new HTTPServerTransport({ body }, responseHandler));
            try {
                await server.serve(config);
            }
            catch (e) {
                response.statusCode = 500;
                response.write(`500 Server Error: ${e.message}`);
            }
            return;
        }
        return handler(request, response, {
            public: path.resolve(process.cwd(), dist),
            cleanUrls: true,
        });
    });
    server.listen(port, () => {
        console.log(`Running at http://localhost:${port}/`);
    });
};
const config = {
    kits: [asRuntimeKit(ClaudeKit), asRuntimeKit(Core)],
    proxy: [
        "generateCompletion",
        "secrets",
        // {
        //   node: "secrets",
        //   tunnel: { CLAUDE_API_KEY: ["generateCompletion"] },
        // },
    ],
};
await startServer("./dist/ui/", "8080", config);
//# sourceMappingURL=index.js.map