var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Account = artifacts.require("./Account.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Account);
};
