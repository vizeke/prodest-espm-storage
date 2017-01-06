const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
var ts = require('gulp-typescript');
var path = require( 'path' )
var clean = require( 'gulp-clean' )

let paths = {
    srcPath: 'src/',
    buildPath: 'build/',
    src: [ 'src/**/*.ts' ],
    build: [ 'build/' ]
};

gulp.task( 'clean', function () {
    return gulp
        .src( paths.build, { read: false })
        .pipe( clean() )
});

gulp.task( 'build', [ 'clean' ], function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    return gulp.src( paths.src )
        .pipe( sourcemaps.init() )
        .pipe( ts() ) 
        .pipe( sourcemaps.write( '.', { includeContent: true, sourceRoot: ( file ) => path.join( __dirname, paths.srcPath ) }) )
        .pipe( gulp.dest( paths.buildPath ) );
});