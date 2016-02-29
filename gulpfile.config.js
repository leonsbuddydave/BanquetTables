'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.source = './src/';

        this.tsOutputPath = './bin/';
        this.allTypeScript = this.source + 'ts/**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;