// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";


contract DAC is ERC20Burnable, Ownable, ERC20Capped {
    uint256 private constant  CAP = 5600000;

    constructor() ERC20("DAC Token", "DAC") ERC20Capped(CAP * (10 ** decimals())) {
    }

    function decimals() public view virtual override returns (uint8) {
        return 12;
    }

    function _mint(address _spender, uint256 amount)internal virtual override(ERC20, ERC20Capped){
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(_spender, amount);
    }

    function mint(address _spender, uint256 amount) public onlyOwner virtual {
        _mint(_spender, amount);
    }
}