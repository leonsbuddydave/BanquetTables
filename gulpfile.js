var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({debug: true, lazy: false});
var rimraf = require('rimraf');
var tsProject = plugins.typescript.createProject('tsconfig.json', { sortOutput: true });
var Config = require('./gulpfile.config');
var browserSync = require('browser-sync');

var reload = browserSync.reload;
var config = new Config();

gulp.task('dist', ['clean', 'scripts', 'templates', 'styles'], function() {
	return gulp.src('.tmp/**/*').pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
	rimraf('{dist,bin,.tmp}', cb);
});

gulp.task('scripts', ['clean'], function() {
	return gulp
		.src(config.allTypeScript)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.typescript(tsProject))
		// .pipe(plugins.concat('application.js'))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('styles', ['clean'], function() {
	return gulp.src('src/styles/**/*.scss')
	    .pipe(plugins.plumber())
	    .pipe(plugins.sourcemaps.init())
	    .pipe(plugins.sass.sync({
	      outputStyle: 'expanded',
	      precision: 10,
	      includePaths: ['.']
	    })).on('error', plugins.sass.logError)
	    .pipe(plugins.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
	    .pipe(plugins.concat('application.css'))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest('.tmp/styles'))
      .pipe(reload({stream: true}));
});

gulp.task('templates', ['clean'], function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('.tmp'))
});

gulp.task('serve', ['clean', 'scripts', 'templates', 'styles'], function() {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: ['.tmp']
		}
	});

	gulp.watch([
		'src/*.html',
		'.tmp/scripts/**/*.js'
	]).on('change', reload)

	gulp.watch('src/**/*.ts', ['scripts']);
	gulp.watch('src/**/*.html', ['templates']);
	gulp.watch('src/**/*.scss', ['styles']);
});