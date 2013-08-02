#!/usr/bin/env node
/* 
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development 
and basic DOM parsing.

References:

  + cheerio
    - https://github.com/MatthewMueller/cheerio
    - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
    - http://maxogden.com/scraping-with-node.html

  + commander.js
    - https://github.com/visionmedia/commander.js
    - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

  + JSON
    - http://en.wikipedia.org/wiki/JSON
    - https://developer.mozilla.org/en-US/docs/JSON
    - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var rest = require('restler');
var util = require('util')
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT= "checks.json";
var URLFILE_DEFAULT = "http://fierce-reaches-1073.herokuapp.com"
var CSVFILE_DEFAULT = "";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
       console.log("%s does not exist. Exiting." ,instr);
       process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(inURL) {
   var instr = inURL.toString();
   return instr;
};

/*
//first concept based on marketresearch.js
var getURLSource= function(inURL){
   var csvfile = 'csvfile.html';
   var response2console = buildfn(csvfile);
   rest.get(inURL.toString()).on('complete', response2console);
   return csvfile;
};

var buildfn =function(csvfile){
   var response2console = function(result, response){
     if (result instanceof Error) {
        console.error('Error: ' + util.format(response.message));
     }else{
        console.error("Wrote %s", csvfile);
        fs.writeFileSync(csvfile, result);
     }
   };   
   return response2console;
};
 */
var checkUrlFile = function(inURL, checksfile) {
    var uout = {};
    var csvfile = 'csvfile.html';
    rest.get(inURL).on('complete', function(result, response){
      if (result instanceof Error) {
        console.error('Error: ' + util.format(response.message));
      }else{
        console.error("Wrote %s", csvfile);
        fs.writeFile(csvfile, result);
        var checkJson = checkHtmlFile('csvfile.html'
, checksfile);
        var outJSon = JSON.stringify(checkJson,null,4);
        console.log(outJson);
      }
    });
//    if(uout.isEmpty){
//      console.log('empty out');
//    } else { console.log('not empty');
    console.log('before out', uout);
   return uout;
};   

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile= function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks){
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
//console.log("main mdule");
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_file>', 'Path to url', clone(assertURLExists), URLFILE_DEFAULT)
        .parse(process.argv);
//    if (program.file){
//        var checkJson = checkHtmlFile(program.file, program.checks);
//    }
//console.log(program.url);
      if (program.url != URLFILE_DEFAULT) {
         var checkUrl = checkUrlFile(program.url, program.checks);
         //var checkJson = checkHtmlFile('csvfile.html', program.checks);
         // cannot get the following to work, but should work... need to revisit
         //var checkJson = checkUrlFile(program.url, program.checks);
      }else{
         var checkJson = checkHtmlFile(program.file, program.checks);
      
    var outJson= JSON.stringify(checkJson,null,4);
    console.log(outJson);
      }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}   
 
