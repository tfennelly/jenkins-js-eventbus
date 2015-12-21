var jsTest = require("jenkins-js-test");

describe("index.js", function () {
    it("- onPubSubEvent", function (done) {
        jsTest.onPage(function() {
            var eventBusFactory = require('../internal/event-bus-factory.js');
            
            var selector = eventBusFactory.toSQL92Selector({
                prop1: 'prop1Val'
            });            
            expect(selector).toBe("prop1 = 'prop1Val'");
            
            selector = eventBusFactory.toSQL92Selector({
                prop1: 'prop1Val',
                prop2: 20
            });            
            expect(selector).toBe("prop1 = 'prop1Val' AND prop2 = '20'");
            
            done();                
        });
    });
});