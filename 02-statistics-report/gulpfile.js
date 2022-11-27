import gulp from 'gulp';

import ts from 'gulp-typescript';



export const compileTypeScript = () => {

    const tsProject = ts.createProject('tsconfig.json');

    return gulp.src('source/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('target/'));

};

export const build = gulp.series(compileTypeScript);

export default build;
