var jQuery = require('jquery-detached');
var $ = jQuery.getJQuery();
var factory = require('./internal/event-bus-factory.js')

var api = factory.newEventBus($);

exports.onPubSubEvent = api.onPubSubEvent;
exports.offPubSubEvent = api.offPubSubEvent;
exports.stop = api.stop;