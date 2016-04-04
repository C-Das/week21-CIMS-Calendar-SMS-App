describe('Protractor Demo App', function() {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
    var thirdNumber = element(by.model('third'));
  var operator = element(by.model('operator'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('latest'));

  beforeEach(function() {
    browser.get('http://juliemr.github.io/protractor-demo');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Super Calculator');
  });

  it('should divide 42 by 7 accurately', function() {
    var answer = 42 / 7;

    firstNumber.sendKeys(42);
    operator.sendKeys('/');
    secondNumber.sendKeys(7);

    goButton.click();

    expect(latestResult.getText()).toEqual('6');
  });

  it('should divide 100 by -2 accurately', function() {
    var answer = 100 / -2;

    firstNumber.sendKeys(100);
    operator.sendKeys('/');
    secondNumber.sendKeys(-2);

    goButton.click();

    expect(latestResult.getText()).toEqual('-50');
  });

  it('should divide 100 by 0 accurately', function() {
    var answer = 100 / 0;

    firstNumber.sendKeys(100);
    operator.sendKeys('/');
    secondNumber.sendKeys(0);

    goButton.click();

    expect(latestResult.getText()).toEqual('jkfdsfkjjsd');
  });

});
