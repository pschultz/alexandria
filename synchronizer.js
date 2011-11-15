var util = require("util");
var events = require("events");

var Synchronizer = function(waitForEvents) {
  events.EventEmitter.call(this);

  this.checklist = [];
  this.started = false;

  this.waitFor.apply(this, arguments);
  
  if(this.checklist.length > 0) {
    this.notifyWhenSynced();
  }
};

util.inherits(Synchronizer, events.EventEmitter);

Synchronizer.prototype.waitFor = function(events) {
  for(k in arguments) {
    if(arguments[k].constructor == Array) {
      this.waitFor(arguments[k]);
    }
    else if(typeof arguments[k] === 'string') {
      this.checklist.push(arguments[k]);
    }
  }
};

Synchronizer.prototype.notifyWhenSynced = function() {
  this.started = true;
  this.emitSyncedIfReady();
};
Synchronizer.prototype.deferSyncedEvent = function() {
  this.started = false;
};

Synchronizer.prototype.emit = function(event) {
  events.EventEmitter.prototype.emit.apply(this, arguments);

  for(k in this.checklist) {
    if(this.checklist[k] == event) {
      this.checklist.splice(k, 1);
      break;
    }
  }

  this.emitSyncedIfReady();
};

Synchronizer.prototype.emitSyncedIfReady = function() {
  if(this.started && this.checklist.length == 0) {
    this.started = false;
    events.EventEmitter.prototype.emit.apply(this, ['synchronized']);
  }
};

module.exports = Synchronizer;
