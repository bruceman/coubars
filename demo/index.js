var dombars = require('dombars/runtime');

dombars.subscribe = function (obj, name, fn) {
    console.log(obj);
    console.log(name);
    console.log(fn);
     Object.defineProperty(obj,  name, {
        get: function () {
            return obj["_"+name];
        },
        set: function(value) {
            console.log('set: ' + name + " -> " + value);
          obj["_"+name] = value;
          fn();
        },
        configurable: true
      });
  
};

dombars.registerHelper('upper', function (string, options) {
    console.log(options);
  return string.toUpperCase();
});

dombars.registerHelper('currentTime', function (options) {
    var node = document.createTextNode(new Date().toLocaleTimeString());
  console.log(options)
    // Update the time in 1 second.
    window.setTimeout(options.update, 1000);
  
    return node;
  });


var testData = { title: 'hello,coubar', show: true, items: [11,22,33] };
var template = require('./index.hbs');
document.body.appendChild(template(testData));

// Every 2 seconds we will be turning the checkbox on and off again.
// testData.show = !testData.show;
  window.setInterval(function () {
    testData.show = !testData.show;
    testData.items = [100,200,300].map(function(num) {
        return Math.round(num * Math.random());
    });
  }, 1000);

//browserify -t dombarsify dombars-test.js -o dombars-test-bundle.js