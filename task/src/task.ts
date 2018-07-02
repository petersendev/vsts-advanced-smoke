import * as tl from 'vsts-task-lib';
import * as smoke from "advanced-smoke";
import * as delay from "delay";

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
    const strictSSL = tl.getBoolInput("strictSSL", true);
    const proxy = tl.getInput("proxy", false);

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

    const retryCount = parseInt(tl.getInput("retryCount", true), 10);
    const retryDelay = parseInt(tl.getInput("retryDelay", true), 10);

    const tlLogger = {
        log: (...args) => { console.log(...args); },
        error: (...args) => { tl.warning(args.join(" ")); }
    }

    let error = false;
    let attempts = 0;


    console.log(retryCount > 0 ? `Starting tests, will retry ${retryCount} times with a delay of ${retryDelay}ms` : "Starting tests");

    do
    {
        if (attempts > 0)
        {
            console.log("==============================================================================");
            console.log(`retry ${attempts} of ${retryCount}, delaying ${retryDelay}ms.`);
            await delay(retryDelay);
        }

        attempts++;
        error = false;

        for (let url of urls)
        {
            try
            {
                error = !await smoke.smokeTest({
                    url,
                    status,
                    method: method.toUpperCase(),
                    proxy,
                    headers,
                    strictSSL,
                    timeout,
                    resolveWithFullResponse: true,
                }, tlLogger) || error;
            }
            catch (e)
            {
                tl.warning(e);
                error = true;
            }
        }
    }
    while (error && attempts <= retryCount);

    tl.setResult(error ? tl.TaskResult.Failed : tl.TaskResult.Succeeded, error ? "Smoke test(s) failed" : "Smoke test(s) succeeded");
}

run();