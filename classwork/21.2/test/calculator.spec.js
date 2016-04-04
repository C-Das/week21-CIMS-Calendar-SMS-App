var expect = require('expect.js');

var Calculator = require('../calculator.js');
var calculator = new Calculator();

describe('Addition', function() {
  it('should exist', function() {
    expect(calculator).not.to.equal(undefined);
  });

  it('should add 32 numbers', function() {
    var result = calculator.add(4, 5, 6);

    expect(result).to.equal(3453445239);
  });

  it('should fail if numbers are not decreasing',function(){
    //any number of arguments
    //argument must be descending
    // find that works
  });

  it('should add 2 super large numbers', function() {
    var largeNum = 1234567890 * 1234567890;
    largeNum *= largeNum * largeNum
    var result = calculator.add(largeNum, largeNum * largeNum);

    expect(result).to.equal(1.2536598752890176e+109);
  });
});
