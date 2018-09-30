import { MockTestRunner } from "vsts-task-lib/mock-test";

import * as path from "path";


const showOutput = process.env.SYSTEM_DEBUG === "true";
console.log("showOutput", showOutput ? "true" : "false");

describe("the advanced smoke task", () =>
{
    it("should succeed with only one URL and default values", async () =>
    {
        const tp = "dist-testruns/single-defaults.js";
        const tr: MockTestRunner = new MockTestRunner(tp);


        tr.run();
        if (showOutput)
        {
            console.log(tr.stdout, tr.stderr, tr.succeeded);
        }

        expect(tr.succeeded).toBeTruthy();
        expect(tr.stdOutContained("testing url https://google.com")).toBeTruthy();
        expect(tr.stdOutContained("SUCCESS: received status code 200, expected 200")).toBeTruthy();
        expect(tr.stdOutContained("Smoke test(s) succeeded")).toBeTruthy();

        expect(tr.stderr).toBeFalsy();

        expect(tr.warningIssues.length).toEqual(0);
        expect(tr.errorIssues.length).toEqual(0);

    });

    it("should succeed with only one URL and all options", async () =>
    {
        const tp = "dist-testruns/single-all-opts.js";
        const tr: MockTestRunner = new MockTestRunner(tp);


        tr.run();
        if (showOutput)
        {
            console.log(tr.stdout, tr.stderr, tr.succeeded);
        }

        expect(tr.succeeded).toBeTruthy();
        expect(tr.stdOutContained("Starting tests, will retry 3 times with a delay of 1000ms")).toBeTruthy();
        expect(tr.stdOutContained("testing url https://google.com")).toBeTruthy();
        expect(tr.stdOutContained("SUCCESS: received status code 405, expected 405")).toBeTruthy();
        expect(tr.stdOutContained("Smoke test(s) succeeded")).toBeTruthy();

        expect(tr.stderr).toBeFalsy();

        expect(tr.warningIssues.length).toEqual(0);
        expect(tr.errorIssues.length).toEqual(0);

    });
});