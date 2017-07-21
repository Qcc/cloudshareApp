//引入gulp和gulp插件
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    jshint = require('gulp-jshint');
webserver = require('gulp-webserver');
uglify = require("gulp-uglify"); // js 压缩
rename = require('gulp-rename');
minifyCss = require("gulp-minify-css"); // css 压缩
minifyHtml = require("gulp-minify-html"); // html 压缩
less = require("gulp-less"); // less 编译

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    return gulp.src('src/style/*.less')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/style'))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/temp/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/temp/js'));
});
//构建html
gulp.task('Html', function() {
    return gulp.src('src/*.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function() {
    return gulp.src(['dist/temp/**/*.json', 'dist/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));
});
//打包图片
gulp.task('img', function() {
    return gulp.src(['src/images/*.*'])
        .pipe(gulp.dest('dist/images'));
});

//开发构建
gulp.task('dev', function(done) {
    condition = false;
    runSequence(
        ['Html'], ['revJs'], ['revCss'], ['img'], ['revHtml'],
        done);
});

// 启动dev服务器
gulp.task('webserver', ['dev'], function() {
    gulp.src('dist')
        .pipe(webserver({
            host: '192.168.200.178',
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('default', ['webserver'], function() {
    gulp.watch('src/images/*.*', ['dev'])
    gulp.watch('src/js/*.js', ['dev'])
    gulp.watch('src/style/*.less', ['dev'])
    gulp.watch('src/*.html', ['dev'])
});