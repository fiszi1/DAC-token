let Vest = artifacts.require("Vesting");  //1. create migration 2_vesting.js
let DAC = artifacts.require("DAC");
let vesting;
const timestamp = 1677928764; // 13:31 04.03.2023
const timeToWait = 52560000;  // = 20 months
const vestingAmount = BigInt(22400000000000000); // VESTING 224000000000000000 - 4% of emission
const afterMonth = 1680761816;
const afterHalfYear = 1693981016;
const afterYear = 1709709416;


module.exports = async(deployer, network, accounts) => {
    let accForVest = accounts[1];
    await deployer.deploy(Vest, accForVest, timestamp, timeToWait , {from: accounts[1]}); //2. deploy vesting smartcontract
    token = await DAC.deployed();
    vesting = await Vest.deployed();

    await token.mint(vesting.address, vestingAmount); //3. mint tokens to vesting smartcontract

    //4. Check vested amount after some periods
    let month = await vesting.methods["vestedAmount(address,uint64)"](token.address, afterMonth);
    console.log(parseInt(month));
    let halfYear = await vesting.methods["vestedAmount(address,uint64)"](token.address, afterHalfYear);
    console.log(parseInt(halfYear));
    let year = await vesting.methods["vestedAmount(address,uint64)"](token.address, afterYear);
    console.log(parseInt(year));

}