module.exports = function(grunt) {

  grunt.initConfig({

	  	clean: ['dist'],
				
		requirejs: {
			
			build: {
			
				options: {
					
					paths: {
						'backbone': '../vendor/backbone-min',
						'underscore': '../vendor/underscore-min',
						'jquery': '../vendor/jquery-1.9.1.min'
					},
					
					baseUrl: 'src',
			    	
			    	name: 'static-grid',
			    	
			    	out: 'dist/static-grid.js',
			    	
			    	exclude: ['backbone', 'underscore', 'jquery']
				}
		
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('default', ['clean', 'requirejs']);
};