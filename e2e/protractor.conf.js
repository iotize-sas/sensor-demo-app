const { SpecReporter: SpecReporter } = require("jasmine-spec-reporter");
exports.config = {
    allScriptsTimeout: 11e3,
    specs: ["./src/**/*.e2e-spec.ts"],
    capabilities: { browserName: "chrome" },
    directConnect: !0,
    baseUrl: "http://localhost:4200/",
    framework: "jasmine",
    jasmineNodeOpts: {
        showColors: !0,
        defaultTimeoutInterval: 3e4, print: function () { }
    }, onPrepare() {
        require("ts-node").register({ project: require("path").join(__dirname, "./tsconfig.e2e.json") }),
            jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: !0 } }))
    },
    browserName: 'chrome',
    multiCapabilities: [
        {
            browserName: 'chrome'
        },
        {
            browserName: 'chrome',
            chromeOptions: {
                mobileEmulation: {
                    deviceName: 'Galaxy S5'
                }
            }
        },
        {
            browserName: 'chrome',
            chromeOptions: {
                mobileEmulation: {
                    deviceName: 'iPhone 6/7/8'
                }
            }
        },
    ]
};