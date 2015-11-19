var fs = require('fs'),
    babel = require("babel-core"),
    path = require("path");

var copy = function(src, dst, handler) {
    // 读取目录中的所有文件/目录
    var paths = fs.readdirSync(src);

    paths.forEach(function(path) {
        var _src = src + '/' + path,
            _dst = dst + '/' + path;
        var st = fs.statSync(_src);
        // 判断是否为文件
        if (st.isFile()) {
            var source = fs.readFileSync(_src, 'utf8');
            var result = handler && handler({
                path: _src,
                source: source
            });
            if (result && result.source) {
                fs.writeFileSync(_dst, result.source, "utf-8");
            }
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
            if (fs.existsSync(_dst)) {
                deleteFolderRecursive(_dst);
            }
            fs.mkdirSync(_dst);
            copy(_src, _dst, handler);
        }
    });
};

deleteFolderRecursive = function(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = function(sourceDir, disDir) {
    if (fs.existsSync(disDir)) {
        deleteFolderRecursive(disDir);
    }

    fs.mkdirSync(disDir);

    copy(sourceDir, disDir, function(file) {
        var path = file.path;
        var source = file.source;
        if (path.lastIndexOf(".js") === path.length - 3) {
            try {
                var res = babel.transform(source, {
                    "presets": ["es2015"]
                });
                return {
                    source: res.code
                }
            } catch (e) {
                console.warn && console.warn(path+" :::"+e);
                return {
                    source: source
                };
            }
        } else {
            return {
                source: source
            }
        }
    });
}
