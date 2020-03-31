const generator = require("generate-password");
function passGen() {
  return generator.generate({
    length: 8,
    numbers: true
  });
}
module.exports = passGen;
