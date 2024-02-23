function ConvertHandler() {
  this.getNum = function (input) {

    if (!/[^\d\.\/ ]/i.test(input)) return Number(input);

    const idx = input.match(/[^\d\.\/ ]/i)["index"];
    if (idx === 0) return 1;
    if (input.match(/\//g) && input.match(/\//g).length > 1) return { error: "Invalid number" };
      return eval(input.substr(0, idx));
  };

  this.getUnit = function (input) {
    if (!/[^\d\.\/ ]+/i.test(input)) return { error: "Invalid input unit" };
    const units = {
      gal: "gal",
      lbs: "lbs",
      mi: "mi",
      l: "L",
      kg: "kg",
      km: "km",
    };

    const idx = input.match(/[^\d\.\/ ]+/i)["index"];
    const unit = input.substr(idx).toLowerCase();

    if (!units[unit]) return { error: "Invalid input unit" };

    return units[unit];
  };

  this.getReturnUnit = function (initUnit) {
    initUnit = initUnit.toLowerCase();
    return {
      gal: "L",
      lbs: "kg",
      mi: "km",
      l: "gal",
      kg: "lbs",
      km: "mi",
    }[initUnit];
  };

  this.spellOutUnit = function (unit) {
    return {
      gal: "gallon",
      lbs: "pound",
      mi: "mile",
      l: "litre",
      kg: "kilogram",
      km: "kilometer",
    }[unit];
  };

  this.convert = function (initNum, initUnit) {
    initUnit = initUnit.toLowerCase();
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    switch (initUnit) {
      case "gal":
        result = initNum * galToL;
        break;
      case "lbs":
        result = initNum * lbsToKg;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "l":
        result = initNum / galToL;
        break;
      case "kg":
        result = initNum / lbsToKg;
        break;
      case "km":
        result = initNum / miToKm;
        break;
    }
    return Number(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const spInitUnit = this.spellOutUnit(initUnit) + (initNum > 1 ? "s" : "");
    const spReturnUnit = this.spellOutUnit(returnUnit) + (returnNum > 1 ? "s" : "");
    return `${initNum} ${spInitUnit} converts to ${returnNum} ${spReturnUnit}`;
  };
}

module.exports = ConvertHandler;
