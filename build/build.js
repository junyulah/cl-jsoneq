var path = require("path");

var es6 = require("./es6.js");
var log = console.log.bind(console);

var child_process = require("child_process");

var chokidar = require('chokidar');
var watcher = chokidar.watch([path.join(__dirname, "../src"), path.join(__dirname, "../test")], {
    ignored: /[\/\\]\./,
    persistent: true
});

var disDir = path.join(__dirname, "../lib");
var sourceDir = path.join(__dirname, "../src");

var build = function() {
    es6(sourceDir, disDir);
    child_process.exec("npm test" /*command*/ , {} /*options, [optiona]l*/ , function(err, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
    });
}

build();

watcher
    .on('add', function(path) {
        log('File', path, 'has been added');
        build();
    })
    .on('addDir', function(path) {
        log('Directory', path, 'has been added');
        build();
    })
    .on('change', function(path) {
        log('File', path, 'has been changed');
        build();
    })
    .on('unlink', function(path) {
        log('File', path, 'has been removed');
        build();
    })
    .on('unlinkDir', function(path) {
        log('Directory', path, 'has been removed');
        build();
    })
    .on('error', function(error) {
        log('Error happened', error);
    })
    .on('ready', function() {
        log('Initial scan complete. Ready for changes.');
    })
    .on('raw', function(event, path, details) {
        log('Raw event info:', event, path, details);
    })