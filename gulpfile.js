const gulp = require('gulp');
const gulpPlugin = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const del = require('del');
const runSequence = require('run-sequence');

const reload = browserSync.reload;
const pkg = require('./package.json');
const dirs = pkg['t7lab-configs'].directories;

let dev = true;
const browserSyncOptions = {
  logPrefix: 't7lab',
  notify: false,
  port: 8080
};

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean:before', function (done) {
  del([dirs.dist, dirs.src + '/styles/main.css', dirs.src + '/styles/renderfirst.css']).then(function () {
    done();
  });
});


gulp.task('copy', [
  'copy:html',
]);

// task to copy image
gulp.task('copy:images', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('copy:html', function () {
  return gulp.src(dirs.src + '/index.html')
    .pipe(gulpPlugin.replace(/{{t7lab-version}}/g, pkg.version))
    .pipe(gulpPlugin.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:css', function () {
  return gulp.src([dirs.src + '/css/main.css', dirs.src + '/css/renderfirst.css'])
    .pipe(gulp.dest(dirs.dist + '/css/'));
});


gulp.task('copy:misc', function () {
  return gulp.src([

    // Copy all files
    dirs.src + '/**',

    // Exclude the following files
    // (other tasks will handle the copying of these files)
    '!' + dirs.src + '/index.html',
    '!' + dirs.src + '/{css,css/**}'

  ], {

    // Include hidden files by default
    dot: true

  }).pipe(gulp.dest(dirs.dist));
});

gulp.task('generate:main.css', function () {
  return gulp.src(dirs.src + '/styles/index.scss')
    .pipe(gulpPlugin.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', gulpPlugin.sass.logError))
    .pipe(gulpPlugin.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe(gulpPlugin.cssBase64())
    .pipe(gulpPlugin.csso())
    .pipe(gulpPlugin.rename('main.css'))
    .pipe(gulp.dest(dirs.src + '/styles/'))
    .pipe(reload({ stream: true }));
});

gulp.task('generate:renderfirst', function () {
  return gulp.src(dirs.src + '/styles/renderfirst.scss')
    .pipe(gulpPlugin.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', gulpPlugin.sass.logError))
    .pipe(gulpPlugin.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe(gulpPlugin.cssBase64())
    .pipe(gulpPlugin.csso())
    .pipe(gulpPlugin.rename('renderfirst.css'))
    .pipe(gulp.dest(dirs.src + '/styles/'))
    .pipe(reload({ stream: true }));
});

gulp.task('scripts', () => {
  return gulp.src('src/scripts/**/*.js')
    .pipe(gulpPlugin.plumber())
    .pipe(gulpPlugin.sourcemaps.init())
    .pipe(gulpPlugin.babel())
    .pipe(gulpPlugin.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(gulpPlugin.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe(gulpPlugin.eslint.format())
    .pipe(gulpPlugin.if(!browserSync.active, gulpPlugin.eslint.failAfterError()));
}

gulp.task('lint:js', () => {
  return lint('src/scripts/**/*.js')
    .pipe(gulp.dest('src/scripts'));
});

gulp.task('minify:html', function () {
  const htmlminOptions = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true
  };

  return gulp.src([
    dirs.dist + '/index.html'
  ]).pipe(gulpPlugin.smoosher())
    .pipe(gulpPlugin.htmlmin(htmlminOptions))
    .pipe(gulp.dest(dirs.dist));

});

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe(gulpPlugin.cache(gulpPlugin.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('src/fonts/**/*'))
    .pipe(gulpPlugin.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------
gulp.task('build', function (done) {
  runSequence(
    ['clean:before', 'lint:js'],
    'generate:main.css',
    'generate:renderfirst',
    'copy',
    'minify:html',
    done);
});

gulp.task('serve', ['generate:main.css', 'generate:renderfirst'], function () {

  browserSyncOptions.server = dirs.src;
  browserSync(browserSyncOptions);

  gulp.watch([
    dirs.src + '/**/*.html'
  ], reload);

  gulp.watch([
    dirs.src + '/styles/**/*.scss',
    dirs.src + '/img/**/*',
    '!' + dirs.src + '/css/main.css',
    '!' + dirs.src + '/css/renderfirst'
  ], ['generate:main.css', 'generate:renderfirst']);

  gulp.watch([
    dirs.src + '/js/**/*.js',
    'gulpfile.js'
  ], ['lint:js', reload]);

});


gulp.task('serve:build', ['build'], function () {
  browserSyncOptions.server = dirs.dist;
  browserSync(browserSyncOptions);
});

gulp.task('default', ['build']);
