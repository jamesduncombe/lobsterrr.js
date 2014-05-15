module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json'),

    coffee:
      compile:
        files:
          'tmp/<%= pkg.name %>.js': 'source/<%= pkg.name %>.coffee',
        options:
          bare: true
      test:
        files:
          'test/unit/<%= pkg.name %>_spec.js': 'source/<%= pkg.name %>_spec.coffee'

    coffeelint:
      app: ['source/<%= pkg.name %>.coffee']
      test:
        files:
          src:
            ['source/<%= pkg.name %>_spec.coffee']
      options:
        'no_trailing_whitespace':
          level: 'error'

    watch:
      scripts:
        files: ['source/<%= pkg.name %>.coffee'],
        tasks: ['default']
      test:
        files: ['source/<%= pkg.name %>_spec.coffee']
        tasks: ['test']

    exec:
      test:
        command: 'mocha-phantomjs -R dot test/index.html'

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      dist:
        files:
          'build/<%= pkg.name %>.min.js': 'build/<%= pkg.name %>.js'

    jsdoc:
      dist:
        src: ['build/*.js']
        options:
          destination: 'doc'

    concat:
      options:
        seperator: ';'
      dist:
        src: ['source/ajax.min.js', 'tmp/<%= pkg.name %>.js']
        dest: 'build/<%= pkg.name %>.js'

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-jsdoc')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('test', ['coffeelint:test', 'coffee:test', 'exec:test'])
  grunt.registerTask('default', ['coffeelint:app', 'coffee:compile', 'concat'])
  grunt.registerTask('dist', ['default', 'test', 'uglify', 'jsdoc'])

