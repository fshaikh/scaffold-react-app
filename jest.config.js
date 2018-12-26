module.exports = {
    setupTestFrameworkScriptFile: '<rootDir>/testSetup.js',
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js"
    }
}