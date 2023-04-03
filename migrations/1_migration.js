let DAC = artifacts.require("DAC");
let token;

module.exports = async(deployer) => {

    await deployer.deploy(DAC);
    token = await DAC.deployed();
}