
exports.newEventBus = newEventBus;
exports.toSQL92Selector = toSQL92Selector;

function newEventBus($) {
    var adapterFactory = require('amq-ajax-client/internal/amq_jquery_adapter.js');
    var amqAdapter = adapterFactory.newAdapter($);
    var amqFactory = require('amq-ajax-client/internal/amqFactory.js');
    var amq = amqFactory.newAmq(amqAdapter);
    var listeners = [];
    var eventBusAPI = {};
    
    // Connect the ActiveMQ client back to the servlet running in Jenkins 
    amq.init({
        uri: 'jenkins-eventbus',
        logging: true,
        timeout: 20
    });    

    eventBusAPI.onPubSubEvent = function(eventName, eventConsumer, eventProperties) {
        var listenerId = (new Date().getTime()).toString(); // generate an Id using the current time
        var destination = 'topic://' + eventName;
        if (eventProperties) {
            amq.addListener(listenerId, destination, eventConsumer, {selector: toSQL92Selector(eventProperties)});
        } else {
            amq.addListener(listenerId, destination, eventConsumer);
        }
        listeners.push({
            id: listenerId,
            destination: destination,
            eventConsumer: eventConsumer
        });
        return true;
    };

    eventBusAPI.offPubSubEvent = function(eventConsumer) {
        var reg = getListenerRegistration(eventConsumer);
        if (reg) {
            amq.removeListener(reg.id, reg.destination);
            return true;
        } else {
            return false;
        }
    };
    
    // TODO: Add an option to remove all event consumers bound to the current browser session?
    
    eventBusAPI.stop = function() {
        amq.stop();
    };
    
    function getListenerRegistration(eventConsumer) {
        for (var i = 0; i < listeners.length; i++) {
            var listenerReg = listeners[i];
            if (listenerReg.eventConsumer === eventConsumer) {
                return listenerReg;
            }
        }
        return undefined;
    }
    
    return eventBusAPI;
}

function toSQL92Selector(eventProperties) {
    // Same as PubSubEventConsumer.toSQL92Selector in its Java counterpart.
    // Only supporting simple "equals" "AND" selector for now. Do not want
    // to expose the fact that it's an SQL 92 selector and hence tie us
    // to something that only supports that. KISS !!
    var stringBuilder = '';        
    for (var key in eventProperties) {
        if (eventProperties.hasOwnProperty(key)) {
            var value = eventProperties[key];

            if (value === null || value === undefined) {
                continue;
            }
            if (stringBuilder.length > 0) {
                stringBuilder += " AND ";
            }
            stringBuilder += key + " = " + "'" + value.toString() + "'";
        }
    }
    return stringBuilder;        
}
