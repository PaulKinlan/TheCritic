import "@anthropic-ai/sdk/shims/web";
import { Panel } from "./boards/the-panel.js";
import { expose } from "comlink";
import "./lib/comlink-async.js";
expose(new Panel());
//# sourceMappingURL=worker.js.map