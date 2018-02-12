// Include gulp
var gulp          = require('gulp');
var sass          = require('gulp-sass');
var watch         = require('gulp-watch');
var autoprefixer  = require('gulp-autoprefixer');
var notify        = require("gulp-notify");
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;
var pngquant      = require('imagemin-pngquant');
var cache         = require('gulp-cache');
var imagemin      = require('gulp-imagemin');
var include       = require("gulp-include");
var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');
var sourcemaps    = require('gulp-sourcemaps');
var uglifycss     = require('gulp-uglifycss');

var paths = {
    src: {
        html:           'src/**/*.html',
        sass:           'src/sass/**/*.scss',
        vendorCss:      'src/css/vendors/**/*.css',
        img:            'src/img/**/*.{jpg,png,gif}',
        pic:            'src/pic/**/*',
        fonts:          'src/fonts/**/*.*',
        watchScripts:   'src/js/**/*.js',
        js: [
            {
                dist:   'index.min.js',
                contains: [
                    'src/js/vendors/jquery.2.2.4.js',
                    'src/js/vendors/slick.min.js',
                    'src/js/vendors/jquery.barrating.min.js',
                    'src/js/jquery.main.js'
                ]
            }
        ]
    },
    build: {
        html:           'build/',
        css:            'build/css/',
        vendorCss:      'build/css/vendors',
        img:            'build/img',
        pic:            'build/pic',
        fonts:          'build/fonts/',
        js:             'build/js/'
    },
    clean: './build'
};

gulp.task('build', [
    'html',
    'sass',
    'img_min',
    'pic_img_min',
    'vendorStyles',
    'scripts',
    'fonts'
]);

// Compile Our Sass 
gulp.task('sass', function() {
    return gulp.src(paths.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({ errLogToConsole: true, outputStyle: 'compressed'}))
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css))
        .pipe(reload({stream:true}));
});

// Compile Our js 
gulp.task( 'scripts', function () {
    for ( var i = 0; i < paths.src.js.length; i++ ){
        gulp.src( paths.src.js[ i ].contains )
        // .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat(paths.src.js[ i ].dist))
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.build.js));
    }
});
// Copy fonts
gulp.task('fonts', function () {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts));
});

// Compile Our html 
gulp.task('html', function () {
    gulp.src(paths.src.html) //Выберем файлы по нужному пути        
        .pipe(include())
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(gulp.dest(paths.build.html));
});

// Compiling images from a folder src/img/
gulp.task('img_min', function() {
    return gulp.src(paths.src.img)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(paths.build.img));
});

// Compiling images from a folder src/pic/
gulp.task('pic_img_min', function() {
    return gulp.src(paths.src.pic)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(paths.build.pic));
});

// Transfer and minimize Styles
gulp.task('vendorStyles', function () {
    return gulp.src(paths.src.vendorCss)
        .pipe(uglifycss({
            "maxLineLen": 0,
            "uglyComments": true
        }))
        .pipe(gulp.dest(paths.build.vendorCss));
});

// Browser sync
gulp.task('browser-sync', function() {
    //watch files
    var files = [
        './style.css',
        './*.php',
        './*.html'
    ];
    browserSync.init(files, {
        proxy: "shop.loc",
        notify: false
    });
});

gulp.task('watch', function() {
    watch([paths.src.sass], function() {
        gulp.start('sass');
    });
    watch([paths.src.watchScripts], function() {
        gulp.start('scripts');
    });   
    watch([paths.src.img], function() {
        gulp.start('img_min');
    });
    watch([paths.src.pic], function() {
        gulp.start('pic_img_min');
    });
});

// Default Task 
gulp.task('default', ['build', 'browser-sync', 'watch']);