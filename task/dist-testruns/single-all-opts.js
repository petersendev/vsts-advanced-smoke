"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_run_1 = require("vsts-task-lib/mock-run");
const path = require("path");
const projInfo = require("../package.json");
const taskMain = path.join(__dirname, "../", projInfo.main);
console.log("taskMain", taskMain, __dirname);
let tmr = new mock_run_1.TaskMockRunner(taskMain);
tmr.setInput("inputType", "single");
tmr.setInput("url", "https://google.com");
tmr.setInput("headers", "TestHeader=first header\nTestHeader2=second header");
tmr.setInput("method", "POST");
tmr.setInput("status", "405");
tmr.setInput("strictSSL", "false");
tmr.setInput("timeout", "333");
tmr.setInput("retryCount", "3");
tmr.setInput("retryDelay", "1000");
tmr.run();
//# sourceMappingURL=single-all-opts.js.map