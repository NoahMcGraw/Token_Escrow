pragma solidity ^0.5.0;

contract Account {
  uint256 public balance = 0;

  constructor() public {
  }

  function deposit (uint amount) public {
    balance += amount;
  }

  function withdraw (uint amount) public {
    require(balance >= amount, "Account has insufficient funds");
    balance -= amount;
  }
}
