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
            'dist/tubular.min.js': 'src/tubular.js'
        },
        jshint: [
            'Gruntfile.js',
            'src/*.js'
        ]
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
        }
    });

    // Load all used tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jscs');

    // Start registering tasks
    grunt.registerTask(
        'default',
        'Runs test and minifies js',
        [
            'jshint',
            'jscs',
            'uglify'
        ]
    );
};
