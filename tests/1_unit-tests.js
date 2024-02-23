const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
    test("Should correctly read a whole number input", () => {
      assert.equal(10, convertHandler.getNum("10kg"));
    });
    test("Should correctly read a decimal number input", () => {
      assert.equal(3.23, convertHandler.getNum("3.23"));
    });
    test("Should correctly read a fractional input", () => {
      assert.equal(1 / 4, convertHandler.getNum("1/4kg"));
    });
    test("Should correctly read a fractional input with a decimal", () => {
      assert.equal(1.2, convertHandler.getNum("2.4/2kg"));
    });
    test("Should correctly return an error on a double fraction", () => {
      assert.deepEqual({ error: "Invalid number" }, convertHandler.getNum("3/4/5kg"));
    });
    test("Should correctly default to a numerical input of one when no numerical input is provided", () => {
      assert.equal(1, convertHandler.getNum("kg"));
    });
    test("Should correctly read each valid input unit", () => {
      assert.equal("gal", convertHandler.getUnit("13gal"));
      assert.equal("lbs", convertHandler.getUnit("3.3lbs"));
      assert.equal("mi", convertHandler.getUnit("3mi"));
    });
    test("Should correctly return an error for an invalid input unit", () => {
      const error = { error: "Invalid input unit" };
      assert.deepEqual(error, convertHandler.getUnit("12"));
      assert.deepEqual(error, convertHandler.getUnit("32o"));
      assert.deepEqual(error, convertHandler.getUnit("32dke"));
      assert.deepEqual(error, convertHandler.getUnit("3.2dke"));
    });
    test("Should return the correct return unit for each valid input unit", () => {
      assert.equal("L", convertHandler.getReturnUnit(convertHandler.getUnit("12gal")));
      assert.equal("kg", convertHandler.getReturnUnit(convertHandler.getUnit("12lbs")));
      assert.equal("km", convertHandler.getReturnUnit(convertHandler.getUnit("12mi")));
    });
    test("Should correctly return the spelled-out string unit for each valid input unit", () => {
      assert.equal("litre", convertHandler.spellOutUnit("l"));
      assert.equal("kilogram", convertHandler.spellOutUnit("kg"));
      assert.equal("kilometer", convertHandler.spellOutUnit("km"));
      assert.equal("gallon", convertHandler.spellOutUnit("gal"));
      assert.equal("pound", convertHandler.spellOutUnit("lbs"));
      assert.equal("mile", convertHandler.spellOutUnit("mi"));
    });
    test("Should correctly convert gal to L", () => {
      assert.equal(37.8541, convertHandler.convert(10, "gal"));
    });
    test("Should correctly convert L to gal", () => {
      assert.equal(2.64172, convertHandler.convert(10, "L"));
    });
    test("Should correctly convert mi to km", () => {
      assert.equal(16.0934, convertHandler.convert(10, "mi"));
    });
    test("Should correctly convert km to mi", () => {
      assert.equal(0.13315, convertHandler.convert(1.5 / 7, "km"));
    });
    test("Should correctly convert lbs to kg", () => {
      assert.equal(4.53592, convertHandler.convert(10, "lbs"));
    });
    test("Should correctly convert kg to lbs", () => {
      assert.equal(22.04624, convertHandler.convert(10, "kg"));
    });
  });