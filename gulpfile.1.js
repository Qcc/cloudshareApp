var gulp = require('gulp');
var jshint = require('gulp-jshint');
var webserver = require('gulp-webserver');
var uglify = require("gulp-uglify");// js 压缩
var rename = require('gulp-rename');
var minifyCss = require("gulp-minify-css");// css 压缩
var minifyHtml = require("gulp-minify-html"); // html 压缩
var less = require("gulp-less"); // less 编译
var rev = require('gulp-rev');//对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');
// 启动dev服务器
gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      host: '192.168.200.178',
      livereload: true,
      directoryListing: true,
      open: true
    }));
});
// 检查js代码
gulp.task('js', function () {
    gulp.src(['src/js/*.js'],{base:'./src/'}) // 要压缩的js文件
    // .pipe(jshint())
    // .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(rev())
    // .pipe(rev.manifest())
    // .pipe(rename(function (path) {
    //   path.extname = ".mini.js"
    // }))
    .pipe(gulp.dest('dist')); //压缩后的路径
});

// 处理less文件 压缩并重命名
gulp.task('css', function() {
  gulp.src(['src/style/*.less'],{base:'./src/'})
    .pipe(less())
    // .pipe(minifyCss()) //压缩css
    .pipe(rev())
    // .pipe(rev.manifest())
    // .pipe(rename(function (path) {
    //   path.extname = ".mini.css"
    // }))
    .pipe(gulp.dest('dist'));
});
//压缩html
gulp.task('html', function () {
    gulp.src('src/*.html') // 要压缩的html文件
    .pipe(revCollector())
    // .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('dist'));
});
gulp.task('default',['html','js','css'], function() {
  gulp.watch('src/js/*.js', ['jshint'], function () {});
  gulp.watch('src/style/*.less', [''], function () {});
});