var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

module.exports = function(conf){
	console.info('watching', conf);
	
	gulp.task('scripts', function(cb){
		return gulp.src(conf.scripts)
			.pipe(uglify())
			.pipe(concat('all.js'))
			.pipe(gulp.dest(conf.build + '/asset/js'));
	});
	
	gulp.task('watch', function() {
	  gulp.watch(conf.scripts, ['scripts']);
	});
	
// 	console.log(conf.scripts);
	
	gulp.task('default', ['watch', 'scripts']);
	
	return gulp.start();
};