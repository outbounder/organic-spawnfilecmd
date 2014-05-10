var Organel = require("organic").Organel
var exec = require("child_process").exec
var path = require('path')
var shelljs = require("shelljs")
var format = require("string-template")
var _  = require("underscore")
var killprocess = require("killprocess")

var createLogPrefix = function(options, relativePath) {
  return (options.name?"["+options.name+"-":"[")+relativePath+"]"
}

module.exports = Organel.extend(function(plasma, dna){
  Organel.call(this, plasma, dna)
  if(dna.reactOn)
    this.on(dna.reactOn, this.reaction)
  else
    this.reaction(dna)
  this.on("kill", this.kill)
}, {
  getRelativePath: function(options) {
    var result = options.data.path.split(process.cwd()).pop()
    if(options.dest && options.root)
      result = options.data.path.split(options.root).pop()
    return result
  },
  getDestFile: function(options) {
    var result = null
    if(options.dest && options.root)
      result = path.join(process.cwd(), options.dest, this.getRelativePath(options))
    return result
  },
  reaction: function(options, next) {
    var destFile = this.getDestFile(options)

    if(options.dest && options.root)
      shelljs.mkdir('-p', path.dirname(destFile))

    var logPrefix = createLogPrefix(options, this.getRelativePath(options))
    
    var cmd = format(options.cmd, _.extend({
      srcfile: options.data.path, 
      destfile: destFile
    }, options))

    if(options.log)
      console.log(logPrefix, cmd)
    
    var hasError = false
    this.child = exec(cmd)
    this.child.on("error", function(err){
      if(options.log)
        console.error(logPrefix, err)
      if(next)
        next(err)
      else
        throw err
    })
    this.child.stderr.on("data", function(chunk){
      hasError = true
      console.error(logPrefix, chunk)
    })
    if(options.log)
      this.child.stdout.on("data", function(chunk){
        console.log(logPrefix, chunk)
      })
    this.child.on("exit", function(exitcode) {
      hasError = hasError || exitcode != 0
      if(options.log)
        console.info(logPrefix, hasError?"success":"failure")
      if(next)
        next(hasError?null:new Error(logPrefix+" failed with code "+exitcode))
    })
  },
  kill: function(c, next){
    killprocess(this.child.pid, next)
    return false;
  }
})