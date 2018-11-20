Transfer = {
    web3Provider: null,
    contracts: {},

    init: function () {
        return Transfer.initWeb3();
    },

    initWeb3: function () {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            Transfer.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            Transfer.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(Transfer.web3Provider);

        return Transfer.initContract();
    },

    initContract: function () {
        $.getJSON('Funding.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var FundingArtifact = data;
            Transfer.contracts.Funding = TruffleContract(FundingArtifact);

            // Set the provider for our contract
            Transfer.contracts.Funding.setProvider(Transfer.web3Provider);

            // return App.showLogInForm();
        });

        return Transfer.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '#btn-transfer', Transfer.transfer);
    },

    transfer: function(){
        var fundingInstance;
        var account;
        var amount = document.getElementById("amount").value;
        var sendingAmount = amount*1000000000
        
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            account = accounts[0];
        });
        App.contracts.Funding.deployed().then(function (instance) {
            fundingInstance = instance;
            // Execute adopt as a transaction by sending account web3.padRight(web3.fromAscii("123"), 34)
            return fundingInstance.exchangeToToken({
                from: account,
                gas: 3000000,
                gasPrice: 100,
                value: sendingAmount,
                // value: web3.toWei(amount.toNumber(), "finney" ),
            });
        }).then(function (result) {
            console.log(result);

            if (result.receipt.status === "0x0") {
                alert("Transaction failed!");
            } else {
                alert("Transaction succeeded!");
            }
        }).catch(function (error) {
            console.log(error.message);
        });
    },

};

$(function () {
    $(window).load(function () {
        Transfer.init();
    });
});