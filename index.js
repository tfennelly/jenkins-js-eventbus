var jQuery = require('jquery-detached');
var $ = jQuery.getJQuery();
var factory = require('./internal/event-bus-factory.js')

module.exports = factory.newEventBus($);