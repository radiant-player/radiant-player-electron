import gulp from 'gulp';
import gutil from 'gulp-util';
import rimraf from 'rimraf';
import webpack from 'webpack';

import webpackConfig from './support/config/webpack';

const paths = {
  templates: 'src/app/*.html',
  resources: 'src/resources/**/*',
  out: 'app/out',
  app: 'app',
};

gulp.task('clean', cb => rimraf(paths.dist, cb));

gulp.task('webpack:build', cb => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true,
    }));
    cb();
  });
});

gulp.task('templates', () =>
  gulp.src(paths.templates).pipe(gulp.dest(paths.out))
);

gulp.task('resources', () =>
  gulp.src(paths.resources, { base: 'src' }).pipe(gulp.dest(paths.out))
);

gulp.task('build', ['webpack:build', 'templates', 'resources']);

gulp.task('watch', () => {
  webpack({
    ...webpackConfig,
    watch: true,
  }, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true,
    }));
  });

  return gulp.watch('**', ['templates', 'resources']);
});

gulp.task('default', ['build']);
