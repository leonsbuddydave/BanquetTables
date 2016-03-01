var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var plugins = require('gulp-load-plugins')({debug: true, lazy: false});
var rimraf = require('rimraf');
var tsProject = plugins.typescript.createProject('tsconfig.json', { sortOutput: true });
var Config = require('./gulpfile.config');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

var reload = browserSync.reload;
var config = new Config();

gulp.task('build', function(done) {
	runSequence('clean', ['scripts', 'templates', 'styles', 'test-scripts'], done);
});

gulp.task('dist', ['build'], function() {
	return gulp.src('.tmp/**/*').pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
	rimraf('{dist,bin,.tmp}', cb);
});

gulp.task('scripts', function() {
	return gulp
		.src(config.allTypeScript)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.typescript(tsProject))
		// .pipe(plugins.concat('application.js'))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('test-scripts', ['scripts'], function() {
	return gulp
		.src(["test/**/*.spec.ts", "typings/tsd.d.ts"])
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.typescript())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('.tmp/test'));
});

gulp.task('styles', function() {
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

gulp.task('templates', function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('.tmp'))
});

gulp.task('tdd', ['build'], function(done) {
	var server = new KarmaServer({
		configFile: __dirname + '/karma.conf.js'
	}, done);

	server.start();	

	var refreshFiles = function() {
		server.refreshFiles().then(function() {
			console.log(arguments);
		});
	}

	gulp.watch('test/**/*.spec.ts', ['test-scripts'], refreshFiles);
	gulp.watch('src/**/*.ts', ['scripts'], refreshFiles);
});

gulp.task('serve', ['build'], function() {
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