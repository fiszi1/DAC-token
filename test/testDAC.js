// 1.“totalSupply() токенів при завантаженні контракту дорівнює 0”(цей тест потрібно поставити взамін тесту з попереднього ДЗ(“Що totalSupply() токенів такий як в таблиці”);
//
// “При виконанні transfer() у відправника коректно зменшується баланс і у отримувача - збільшується”
//
// 2.“При виконанні approve() у отримувача коректно змінюється allowance()”
//
// “При виконанні transferFrom() користувачем(отримувачем), якому раніше було дозволено використання токенів іншого користувача(відправника), у відправника коректно зменшується баланс і у отримувача - збільшується”
//
// “Користувач без достатнього allowance не може виконувати transferFrom токенами іншого користувача”
//
// “При виконанні burn() у користувача коректно зменшується баланс”
//
// “_owner смарт-контракту співпадає із користувачем що завантажив контракт”
//
// “Лише _owner може чеканити нові токени”
//
// “Інші користувачі не можуть чеканити нові токени”
//
// “Немає способу збільшити _totalSupply понад значення _cap”.


let DAC = artifacts.require("DAC");
let token;
const CAP = BigInt(5600000000000000000);



contract("DAC Token", async(accounts)=> {

    const ACC_1 = accounts[0];
    const ACC_2 = accounts[1];
    const ACC_3 = accounts[2];

    it("Initial totalSupply() equals to 0", async () => {
        //deploy token
        token = await DAC.deployed();
        //check totalSupply
        let supply = await token.totalSupply();

        assert.equal(0, supply, "Initial suppply should be equal to 0");
    });

    it("method transfer() works correctly", async()=>{
        // mint full cap tokens
        await token.mint(ACC_1, CAP);
        //make transfer all tokens
        await token.transfer(ACC_2, CAP);
        //check balance acc_1
        let balance_1 = await token.balanceOf(ACC_1);
        //check balance acc_2
        let balance_2 = await token.balanceOf(ACC_2);

        assert.equal(parseInt(balance_1), 0, "Balance of account1 should equal to 0");
        assert.equal(parseInt(balance_2), CAP, "Balance of account2 should be equal to CAP constant");

        await token.transfer(ACC_1, CAP, {from: ACC_2}); //send money back for further tests
    })

    it("method approve() changes allowance() correctly and should return max CAP ", async()=>{
        await token.approve(ACC_2, CAP);
        let allowance = await token.allowance(ACC_1, ACC_2); // should return amount of CAP;

        assert.equal(CAP, BigInt(allowance), "Allowance of ACC_2 should be equal to CAP.")
    })

    it("method transferFrom() works correctly", async()=> {
        await token.transferFrom(ACC_1, ACC_2, CAP, {from: ACC_2}); //send all tokens from acc1 to acc2

        //check balance acc_1
        let balance_1 = await token.balanceOf(ACC_1);
        //check balance acc_2
        let balance_2 = await token.balanceOf(ACC_2);

        assert.equal(parseInt(balance_1), 0, "Balance of account1 should equal to 0");
        assert.equal(parseInt(balance_2), CAP, "Balance of account2 should be equal to CAP constant");
    })

    it("User without allowance cannot use transferFrom", async()=> {
        let message;
        try {
            await token.transferFrom(ACC_1, ACC_2, CAP, {from: ACC_3});
        } catch (e) {
            message =  e.message
        }

        assert.isTrue(message.indexOf("revert") >= 0, "Expected revert didn't work.");
    })

    it("Method burn() decreases balance of user correctly", async()=> {
        await token.burn(CAP, {from: ACC_2});
        let balance = await token.balanceOf(ACC_2);

        assert.equal(0, balance, "Expected balance doesn't equal to 0");
    });

    it("Same owner that deployed contract", async()=> {
        //find owner that deployed contract
        let firstlyDeployed = await DAC.deployed(DAC);
        let firstOwner = firstlyDeployed['constructor']['class_defaults']["from"];
        //call owner() method
        let checkOwner = await token.owner();

        assert.equal(firstOwner, checkOwner,"Owner is not same as per deploying.");
    })

    it("Only owner can mint tokens", async()=> {
        let ownerMint = await token.mint(ACC_1, CAP, {from: ACC_1});
        //check if transaction succesfull
        assert.isTrue(ownerMint.receipt["status"], "Expected no errrors");
    })


    it("Other users can't mint tokens", async()=> {
        let message;
        let mintFromOtherAcc;
        try {
            mintFromOtherAcc = await token.mint(ACC_1, CAP, {from: ACC_3});
        } catch(e) {
            message = e.message;
        }

        assert.isTrue(message.indexOf("revert") >= 0, "Only owner can mint");
    });

    it("Cannot mint more than supply cap", async()=> {
        let mintMore;
        let message;
        try{
            //mint 2x CAP
            mintMore = await token.mint(ACC_1, CAP + CAP, {from: ACC_1});
        } catch (e) {
            message = e.message;
        }

        assert.isTrue(message.indexOf("revert") >= 0, "Expected revert - cap exceeded didn't work.");
    })



});