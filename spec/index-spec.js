var jsTest = require("jenkins-js-test");

describe("index.js", function () {
    it("- onPubSubEvent", function (done) {
        jsTest.onPage(function() {
            var $ = require('jquery-detached').getJQuery();
            var requests = [];
            
            $.ajax = function(request) {
                requests.push(request);
            };            
            
            var eventBus = require('../index.js');
            var consumer = function () {};
            eventBus.onPubSubEvent('job', consumer, {
                jobName: 'webapp-xyz',
                runResult: 'FAILED'                
            });

            eventBus.stop();
            
            expect(requests[0].url).toBe('/jenkins/jenkins-eventbus');
            expect(requests[0].data).toContain('timeout=1');
            expect(requests[0].beforeSend).toBeDefined();
            expect(requests[1].url).toBe('/jenkins/jenkins-eventbus');
            expect(requests[1].data).toContain('destination=topic://job&message');
            expect(requests[1].beforeSend).toBeDefined();
            
            done();                
        });
    });
});