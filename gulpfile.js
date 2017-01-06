const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const del = require('del');
const spawn = require('child_process').spawn;

gulp.task('default', ['clean', 'js', 'css', 'html', 'libs']);

gulp.task('html', () => {
	return gulp.src('client/index.html')
		.pipe(gulp.dest('client-dist/'));
});

gulp.task('css', () => {
	return gulp.src('client/css/**/*')
		.pipe(watch('client/css/**/*'))
		.pipe(plumber())
		.pipe(gulp.dest('client-dist/css'));
});

gulp.task('js', () => {
	return gulp.src('client/src/**/*')
		.pipe(watch('client/src/**/*'))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			modules: 'amd'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('client-dist/src'));
});

gulp.task('libs', () => {
	return gulp.src('client/lib/**/*')
		.pipe(gulp.dest('client-dist/lib'));
});

gulp.task('clean', (cb) => {
	del(['client-dist'], cb);
});

// gulp.task('lint', (cb) => {
// 	const lint = spawn('eslint', ['client/src'], {
// 		stdio: 'inherit'
// 	});
// 	lint.on('close', cb);
// });
