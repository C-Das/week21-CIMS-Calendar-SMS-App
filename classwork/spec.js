describe("Calculator App", function(){
  var latestResult = element(by.binding("latest"));
  var firstNumber = element(by.model("first"));
  var secondNumber = element(by.model("second"));
  var operator = element(by.model("operator"));
  var goButton = element(by.id('gobutton'));

  function add(a, b){
    firstNumber.sendKeys(a);
    secondNumber.sendKeys(b);
    goButton.click();
  }

  beforeEach(function(){
    browser.get("http://juliemr.github.io/protractor-demo/");
  });

  it("should have a title", function(){
    expect(browser.getTitle()).toEqual("Super Calculator");
  });

  it("should add two positive numbers", function(){
    add(2,2);

    expect(latestResult.getText()).toEqual("4");
  });


  it("should add two negative numbers", function(){
    add(5,-10);

    expect(latestResult.getText()).toEqual("-5");
  });

  it("should have a history", function(){
    var history = element.all(by.repeater('result in memory'));
    add(2,2);
    add(1,3);

    expect(history.count()).toEqual(2);

    add(2,7);

    expect(history.count()).toEqual(3);
  });
});
