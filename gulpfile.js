// Include plugins
var
    path        = require('path')

  , gulp        = require('gulp')
  // , sourcemaps  = require('gulp-sourcemaps')
  // , gutil       = require('gulp-util')

  , coffeelint  = require('gulp-coffeelint')
  , tap         = require('gulp-tap')
  , concat      = require('gulp-concat')
  , header      = require('gulp-header')
  , coffee      = require('gulp-coffee')
  , rename      = require('gulp-rename')
  , uglify      = require('gulp-uglify')

  , stylus      = require('gulp-stylus')
  , nib         = require('nib')
  , minifyCSS   = require('gulp-minify-css')

  , jade        = require('gulp-jade')

  // , jsdoc       = require("gulp-jsdoc")
  , vows        = require('gulp-vows')
  , qunit       = require('node-qunit-phantomjs')

  , browserSync = require('browser-sync') // $ sudo npm install -g browser-sync
  , reload      = browserSync.reload
;


// Configuration
// @todo


// Helper to compile a set of CoffeeScript files
var compileCoffee = function (opt, cb) {
    gulp.src(opt.src)

       // Lint
       .pipe( coffeelint() )
       .pipe( coffeelint.reporter() )

       // Concatenate
       .pipe( tap(coffeePreConcat) )
       .pipe( concat(opt.max) )
       .pipe( header(coffeePostConcat(opt.meta)) )

       // Compile
       // .pipe( sourcemaps.init() )
       .pipe( coffee() )
       // .pipe( sourcemaps.write() )
       .pipe( gulp.dest('./build') )
       .pipe(reload({stream:true}))

       // Minify
       .pipe( rename(opt.min) )
       .pipe( uglify() )
       .pipe( gulp.dest('./build') )
       .pipe(reload({stream:true}))
    ;
    if (cb) {
        cb(); // https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md
    }
}


// Helper to compile a set of Stylus files
var compileStylus = function (opt) {
    gulp.src(opt.src)

       // Concatenate
       .pipe( tap(stylusPreConcat) )
       .pipe( concat('tmp.styl', {newLine: '\n'}) ) // @todo is this file actually made? What’s going on here?!
       .pipe( header(stylusPostConcat(opt.meta)) )

       // Compile and inject CSS
       .pipe( stylus({ use:[nib()] }) )
       .pipe( rename(opt.max) )
       .pipe( gulp.dest('./build') )
       .pipe(reload({stream:true}))

       // Minify and inject CSS
       .pipe( rename(opt.min) )
       .pipe( minifyCSS() )
       .pipe( gulp.dest('./build') )
       .pipe(reload({stream:true}))
    ;
}


// Helper to compile a Jade template
var compileJade = function (opt) {
    gulp.src(opt.src)
       .pipe( jade({
            locals:{ title:opt.meta.title, name:opt.meta.name }
          , pretty: true
        }) )
       .pipe( gulp.dest('./build/examples/') )
       .pipe(reload({stream:true}))
    ;
}


// Helper for pre-concat CoffeeScript files
var coffeePreConcat = function (file, t) {
    file.contents = Buffer.concat([
        new Buffer( '###*\n# ' + path.relative(__dirname, file.path) + '\n###\n\n' )
      , file.contents
    ]);
}


// Helper for post-concat CoffeeScript files
var coffeePostConcat = function (opt) {
    return [
      , '###*' // http://stackoverflow.com/a/26806499
      , '# '          + opt.description
      , '# @module  ' + opt.name // http://usejsdoc.org/howto-commonjs-modules.html
      , '# @version ' + opt.version
      , '# @author  ' + opt.author
      , '# @license ' + opt.license
      , '###\n'
    ].join('\n')
}


// Helper for pre-concat Stylus files
var stylusPreConcat = function (file, t) {
    file.contents = Buffer.concat([
        new Buffer( '/*!\n * ' + path.relative(__dirname, file.path) + '\n */\n\n' )
      , file.contents
    ]);
}


// Helper for post-concat Stylus files
var stylusPostConcat = function (opt) {
    return [
      , '/*!' // http://learnboost.github.io/stylus/docs/comments.html#multi-line-buffered
      , ' * '          + opt.description
      , ' * @module  ' + opt.name // http://usejsdoc.org/howto-commonjs-modules.html
      , ' * @version ' + opt.version
      , ' * @author  ' + opt.author
      , ' * @license ' + opt.license
      , ' */'
      , "@import 'nib'" // https://github.com/stevelacy/gulp-stylus/issues/47
    ].join('\n')
}


// Lint, concatenate, compile and minify CoffeeScript files
gulp.task('script-library', function (cb) {
    compileCoffee({
        src:  ['./src/api/*.coffee','./src/class/*.coffee']
      , max:  'js/seqin.js'
      , min:  'js/seqin.min.js'
      , meta: require('./package.json')
    }, cb);
});
gulp.task('script-examples', function () {
    compileCoffee({
        src:  ['./src/examples/basic-sequencer/*.coffee']
      , max:  'examples/js/basic-sequencer.js'
      , min:  'examples/js/basic-sequencer.min.js'
      , meta: require('./src/examples/basic-sequencer/basic-sequencer.json')
    });
});


// Concatenate, compile and minify Stylus files
gulp.task('style-library', function () {
    compileStylus({
        src:  ['./src/style/*.styl']
      , max:  'css/seqin.css'
      , min:  'css/seqin.min.css'
      , meta: require('./package.json')
    });
});
gulp.task('style-examples', function () {
    compileStylus({
        src:  ['./src/examples/basic-sequencer/*.styl']
      , max:  'examples/css/basic-sequencer.css'
      , min:  'examples/css/basic-sequencer.min.css'
      , meta: require('./src/examples/basic-sequencer/basic-sequencer.json')
    });
});


// Compile Jade template files
gulp.task('html-examples', function () {
    compileJade({
        src:  ['./src/examples/basic-sequencer/*.jade']
      , meta: require('./src/examples/basic-sequencer/basic-sequencer.json')
    });
});


// Run tests
gulp.task('test', ['script-library'], function () {
    gulp.src("./src/tests/*.spec.js")
       .pipe( vows({reporter: 'spec'}) )
    ;
    qunit('./src/tests/test-runner.html');
});
gulp.task('watched-test-file', function () { // no dependency
    gulp.src("./src/tests/*.spec.js")
       .pipe( vows({reporter: 'spec'}) )
    ;
});


// Generate documentation
gulp.task('jsdoc', ['script-library'], function () {
    // gulp.src("./build/js/seqin.js")
    //    .pipe( jsdoc('./build/docs/') )
    // ;
});


// Browser-sync task for starting the server. See http://www.browsersync.io/docs/gulp/
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});


// Watch files for changes
gulp.task('watch', function() {
    gulp.watch(['./src/api/*.coffee','./src/class/*.coffee'], ['jsdoc', 'test']); // 'jsdoc' and 'test' are dependent on 'script-library'
    gulp.watch(['./src/examples/**/*.coffee']               , ['script-examples']);
    gulp.watch(['./src/style/*.styl']                       , ['style-library']);
    gulp.watch(['./src/examples/**/*.styl']                 , ['style-examples']);
    gulp.watch(['./src/examples/**/*.jade']                 , ['html-examples']);
    gulp.watch(['./src/tests/*.spec.js']                    , ['watched-test-file']);
});


// Default Task
gulp.task('default', ['style-library', 'style-examples', 'script-library', 'script-examples', 'html-examples', 'jsdoc', 'test', 'watch', 'browser-sync']);


