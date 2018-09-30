import { TaskMockRunner } from "vsts-task-lib/mock-run";

import * as path from "path";

const projInfo = require("../package.json");
const taskMain = path.join(__dirname, "../", projInfo.main);
console.log("taskMain", taskMain, __dirname);
let tmr: TaskMockRunner = new TaskMockRunner(taskMain);

tmr.setInput("inputType", "single");
tmr.setInput("url", "https://google.com");

tmr.run();
