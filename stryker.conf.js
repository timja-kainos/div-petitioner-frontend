 module.exports = function(config){ 
   config.set({ 
     mutate: [
         'app/**/*.js',
         '!app/**/*.test.js',
         '!node_modules/*'
     ],     files: [
          '**/*.js',
     ],
     mutator: "javascript",
     testFramework: 'mocha', 
     testRunner: 'mocha',
     maxConcurrentTestRunners: 1,
     mochaOptions: { 
        files: [ '**/*.js' ],
        timeout: 8000 
     }, 
     logLevel: 'debug',
     reporter: ['progress', 'clear-text', 'html'], 
     coverageAnalysis: 'off', 
     plugins: ['stryker-mocha-runner', 'stryker-mocha-framework', 'stryker-html-reporter', 'stryker-javascript-mutator'] 
   }); 
 }

