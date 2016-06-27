/* jshint strict: false */
/**
/**
 * @author Roelof Roos <roelof@schakelmarketeers.nl>
 */

module.exports = function(grunt) {

    // Fix promises
    require('es6-promise').polyfill();

    var constructBanner = function(lines) {
        var bnr = [];

        // Add jshint ignore
        bnr.push('// jshint ignore: start');

        // Start license block
        bnr.push('/**!');

        var prefix = ' * ';

        lines.forEach(function(line) {
            bnr.push(prefix + line);
        });
        bnr.push(' */');

        return bnr.join('\n') + '\n';
    };

    var banner = constructBanner([
        'jQuery tubular plugin',
        '',
        '@author Sean McCambridge <http://www.seanmccambridge.com/tubular>',
        '@author Schakel Marketeers <schakelmarketeers.nl>',
        '@license MIT',
        '',
        '@see http://www.seanmccambridge.com/tubular',
        '@see https://github.com/SchakelMarketeers/tubular'
    ]);

    var files = {
        js: {
            'dist/tubular.min.js': 'src/js/tubular.js'
        },
        jshint: [
            'Gruntfile.js',
            'src/*.js'
        ],
        css: [
            'src/css/*.css'
        ],
        watch: {
            js: 'src/js/*.js',
            css: 'src/css/*.css'
        }
    };

    var AutoPrefixer = require('autoprefixer');
    var CleanCss = require('clean-css');

    var pluginInstances = {
        autoprefixer: AutoPrefixer({
            browsers: 'last 2 versions'
        }),
        cleancss: CleanCss({
            keepSpecialComments: '1',
            processImport: true,
            mediaMerging: true,
            compatibility: '*',
            processImportFrom: ['local']
        })
    };

    var plugins = {
        css: [pluginInstances.autoprefixer, pluginInstances.cleancss]
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: banner,

        // Start of JS minifier
        uglify: {
            main: {
                options: {
                    mangle: true,
                    compress: true,
                    ASCIIOnly: false,
                    preserveComments: 0,
                    banner: banner,
                    quoteStyle: 1
                },
                files: files.js
            }
        },

        // JS Linter
        jshint: {
            files: files.jshint,
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // JS Linter
        jscs: {
            files: files.jshint,
            options: {
                config: '.jscsrc'
            }
        },

        // Postprocess CSS
        postcss: {
            main: {
                files: files.css,
                options: {
                    map: false,
                    processors: plugins.css
                }
            }
        },

        // Watch config
        watch: {
            js: {
                files: files.watch.js,
                tasks: ['js'],
                options: {
                    interrupt: true
                }
            },
            css: {
                files: files.watch.css,
                tasks: ['css'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    // Load all used tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-postcss');

    // Start registering tasks
    //
    // Verifies JS is valid and standards are honored
    grunt.registerTask(
        'test-js',
        'Tests if the Javascript files meet the standards and follow the ' +
        'style guides',
        [
            'jshint',
            'jscs'
        ]
    );

    // Runs all the aforementioned tests in one go. This command is also run
    // before running `dev` or `prod`.
    grunt.registerTask(
        'test',
        'Runs all tests concerning Javascript, Sass, Twig and PHP',
        [
            'test-js'
        ]
    );

    grunt.registerTask(
        'prod',
        'Compiles assets for production',
        [
            'test',
            'uglify',
            // 'postcss'
        ]
    );

    grunt.registerTask(
        'default',
        'prod'
    );
};
