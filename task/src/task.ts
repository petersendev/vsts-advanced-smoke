import * as tl from 'vsts-task-lib';
import * as smoke from "advanced-smoke";

async function run()
{
    const inputType = tl.getInput("inputType", false);

    let urls = [];

    switch (inputType)
    {
        case "single":
            {
                urls = [tl.getInput("url", true)];
                break;
            }
        case "list":
            {
                const urlsInput = tl.getInput("urls", true);
                urls = urlsInput.replace(/\r/g, "").split("\n");
                break;
            }
        default:
            {
                tl.setResult(tl.TaskResult.Failed, `Input type not supported: ${inputType}`);
                return;
            }
    }

    if (!urls || !urls.length)
    {
        tl.setResult(tl.TaskResult.Failed, "At least one URL required");
        return;
    }

    const method = tl.getInput("method", true) || "GET";
    const status = parseInt(tl.getInput("status", true), 10);
    const timeout = tl.getInput("timeout", false) ? parseInt(tl.getInput("timeout", false), 10) : null;

    let headers = null;
    const headersInput = tl.getInput("headers", false);
    if (headersInput)
    {
        headers = {};
        headersInput
            .replace(/\r/g, "")
            .split("\n")
            .map(h => h.split("=").map(x => x.trim()))
            .forEach(header =>
            {
                headers[header[0]] = header[1];
            });
    }

    const retryTimes = parseInt(tl.getInput("retryTimes", false) || "0", 10);
    const retryDelay = parseInt(tl.getInput("retryDelay", false) || "0", 10);


    let error = false;

    const tlLogger = {
        log: (...args) => { console.log(...args); },
        error: (...args) => { tl.error(args.join(" ")); }
    }

    for (let url of urls)
    {
        try
        {
            error = !await smoke.smokeTest({
                url,
                headers,
                method: method.toUpperCase(),
                status,
                timeout,
                resolveWithFullResponse: true
            }, tlLogger) || error;
        }
        catch (e)
        {
            tl.error(e);
            error = true;
        }
    }

    tl.setResult(error ? tl.TaskResult.Failed : tl.TaskResult.Succeeded, error ? "Smoke test(s) failed" : "Smoke test(s) succeeded");
}

run();