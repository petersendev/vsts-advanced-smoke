# Advanced Smoke Test
Cross platform build and release task for executing smoke tests against a single or multiple URLs with header and proxy support. The task also has the option to retry the test(s), if any test fails.

## Single URL
![single-url](images/screenshots/task_single.png)

## Multiple URLs
![multiple-url](images/screenshots/task_list.png)
For multiple URLs a test for each URL will be executed, if any test fails, the task will fail.

## Advanced Options
![advanced-options](images/screenshots/task_advanced.png)

### Expected HTTP status code
The HTTP status code which will be validated. If the server does not respond with the specified status code, the test will fail.

### HTTP method
The HTTP method which will be used for all requests.

### Headers
List of headers which will be sent with the request(s).
One per line, in the following format:
```
MyHeader=my header value
MySecondHeader=2nd
```

### Proxy
The proxy server used for the request(s).

Alternatively you can specify the `ADVANCED_SMOKE_PROXY` environment variable.

`HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables are also supported.

### Strict SSL
Whether SSL certificates are required to be valid.

### Timeout
Timeout in milliseconds for the server to respond. If no timeout is specified, the default from the request module (and in some cases from the OS) will be used.

### Retries
Number of retries, which will be executed in case of any errors during the test(s). Useful if used directly after deployment to handle warmup.

### Retry delay
Delay (in milliseconds) between retries.

## Credits

This task is using the [advanced-smoke](https://www.npmjs.com/package/advanced-smoke) npm package ([GitHub](https://github.com/petersendev/node-advanced-smoke)) which also offers a CLI.

Logo: "[Smoke](https://thenounproject.com/term/smoke/952776/)" icon by Beau Wingfield from [from the Noun Project](http://thenounproject.com/).