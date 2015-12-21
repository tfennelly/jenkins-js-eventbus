Jenkins event bus API for JavaScript/browser clients.

# TODOs

- [x] Basic pub-sub implementation.
- [x] Basic usage example
- [ ] More tests, especially integration tests
- [ ] Performance testing. Flood of events/messages.

# JavaScript Pub-Sub Example

The following will listen for Job run events.

```javascript
var eventBus = require('jenkins-js-eventbus');
eventBus.onPubSubEvent('job', 
    function(eventMsg) {
        // Handle event
        var runNumber = eventMsg.runNumber;
        var runStatus = eventMsg.runStatus;        
        var runResult = eventMsg.runResult;        
        var runUrl = eventMsg.url;
        
        // etc ...
    }, {
        jobName: 'webapp-xyz',
        type: 'runStateChange'                
    });
```

The 3rd argument is an `eventProperties` object, which acts as a filter on the events you want to receive.
So, for example, if you wanted to receive all `runStateChange` events for all jobs, then just drop the `jobName`
property from the supplied `eventProperties` object.

Also see [EventBusServerTest](src/test/java/jenkins/eventbus/EventBusServerTest.java).