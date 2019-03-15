// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');

var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();

// onload = function() {
//     //document.getElementById("btnGetBalance").addEventListener("click", getBalance);
//     loadAccount();
// }

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}
addLoadEvent(firstLoad)
var loaddingAccount = true;
function firstLoad() {
    $('#tab ul li:eq(0)').click(async function () {
        if(loaddingAccount){
            loadAccount();
        }
        
    });
    loadAccount()
}

function loadAccount() {
    loaddingAccount = false;
    seeleClient.accountList();

    if (seeleClient.txArray == null || seeleClient.txArray.length <= 0) {
        seeleClient.readFile();
    }

    if (seeleClient.accountArray.length > 0) {
        layer.load(0, {
            shade: false
        });
    }

    var count = 0;
    var tabs1 = document.getElementById("tabs-1");
    tabs1.innerHTML = "";

    var tabs1HTML =`<div id="main-container">`
    tabs1HTML +=`<div><h1>Accounts Overview</h1></div>`
    tabs1HTML += `<div><button class="export-account" title="EXPORT ACCOUNTS" onclick="exportaccount()">`
    tabs1HTML += `<span><img src="./src/img/export.png"></span>`
    // tabs1HTML += `<span>EXPORT ACCOUNTS</span>`
    tabs1HTML += `</button>`
    tabs1HTML += `<button class="import-account" title="IMPORT ACCOUNTS" onclick="import()">`
    tabs1HTML += `<span><img src="./src/img/import.png"></span>`
    // tabs1HTML += `<span>IMPORT ACCOUNTS</span>`
    tabs1HTML += `</button></div>`
    tabs1HTML += `</div>`
    tabs1HTML += `<div id="accountlist"></div>`
    tabs1HTML += `<button class="add-account" onclick="addAccount()">`
    tabs1HTML += `<span><img src="./src/img/add.png"></span>`
    tabs1HTML += `<span>ADD ACCOUNT</span>`
    tabs1HTML += `</button>`
    tabs1HTML += `<p class="info">Accounts are password protected keys that can hold seele. They can control contracts, but can't display incoming transactions.</p>`
    tabs1HTML += `<h3 class="latest-title">Latest Transactions</h3>`

    // tabs1HTML += `<div class="account-contact"><p class="contact-left">`
    // tabs1HTML += `<span>Nov.</span><span>13</span>`
    // tabs1HTML += `</p>`
    // tabs1HTML += `<ul class="contact-right"><li>Created Contact</li>`
    // tabs1HTML += `<li><span>0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1</span><span><a href="">https://seelescan.net/#/transaction/detail?txhash=0x4729740df31fa87ab73dcb537e2b6dcd6ac01735f936afd4ff08011747da5b00</a></span></li>`
    // tabs1HTML += `</ul>`
    // tabs1HTML += `</div>`

    // tabs1HTML += `<div class="account-contact"><p class="contact-left">`
    // tabs1HTML += `<span>Nov.</span><span>13</span>`
    // tabs1HTML += `</p>`
    // tabs1HTML += `<ul class="contact-right"><li>Transfer Between Accounts</li>`
    // tabs1HTML += `<li><span>0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1</span><span><a href="">https://seelescan.net/#/transaction/detail?txhash=0x4729740df31fa87ab73dcb537e2b6dcd6ac01735f936afd4ff08011747da5b00</a></span></li>`
    // tabs1HTML += `</ul>`
    // tabs1HTML += `</div>`

    for(var item in seeleClient.txArray) {
        var time = new Date(seeleClient.txArray[item].time)
        
        tabs1HTML += `<div class="account-contact"><p class="contact-left">`
        tabs1HTML += `<span>`+time.toDateString().split(" ")[1]+`</span><span>`+time.getDate()+`</span>`
        tabs1HTML += `</p>`
        tabs1HTML += `<ul class="contact-right"><li>Created </li>`
        tabs1HTML += `<li><span onclick="require('electron').shell.openExternal('https://seelescan.net/#/transaction/detail?txhash=`+seeleClient.txArray[item].name.trim() +`')">`+ seeleClient.txArray[item].name.trim() + `</span></li>`
        tabs1HTML += `</ul>`
        tabs1HTML += `</div>`
    }
    tabs1.innerHTML = tabs1HTML

    var balanceArray = new Array()
    for (var item in seeleClient.accountArray) {
        seeleClient.getBalance(seeleClient.accountArray[item].trim(), function (info, err) {
            if (err) {
                try {
                    var msg = JSON.parse(err.message);
                    alert(msg.error.message);
                } catch (e) {
                    alert(err.message);
                }
                var accountlist = document.getElementById("accountlist");
                var accountHTML = ""
                accountHTML += `<div class="accountFor" >`;
                accountHTML += `<span class="accountImg"><img src="./src/img/Headportrait.png"></span>`;
                accountHTML += `<ul>`;
                accountHTML += `<li>Account</li>`;
                accountHTML += `<li><span class="accountBalance">` + "0" + `</span> seele</li>`;
                accountHTML += `<li>` + info[0] + `</li>`;
                accountHTML += `</ul>`;
                accountHTML += `</div>`;
                accountlist.innerHTML += accountHTML;
                if (count == seeleClient.accountArray.length - 1) {
                    layer.closeAll();
                    loaddingAccount = true;
                }
                count += 1;
            } else {
                var accountlist = document.getElementById("accountlist");
                var accountHTML = ""
                accountHTML += `<div class="accountFor" onclick="ToAccountInfo('` + info.Account + `',` + info.Balance / 100000000 + `)">`;
                accountHTML += `<span class="accountImg"><img src="./src/img/Headportrait.png"></span>`;
                accountHTML += `<ul>`;
                accountHTML += `<li>Account</li>`;
                accountHTML += `<li><span class="accountBalance">` + info.Balance / 100000000 + `</span> seele</li>`;
                accountHTML += `<li>` + info.Account + `</li>`;
                accountHTML += `</ul>`;
                accountHTML += `</div>`;
                accountlist.innerHTML += accountHTML;
                if (count == 0) {
                    document.getElementById("txpublicKey").value = info.Account;
                    document.getElementById("contractPublicKey").value = info.Account;                    
                    span_balance.innerText = info.Balance / 100000000;
                }
                if (count == seeleClient.accountArray.length - 1) {
                    layer.closeAll();
                    loaddingAccount = true;
                }
                count += 1;
                balanceArray.push(info.Balance)
            }
            var sum = 0;
            var balanceSum = document.getElementById('span_balance')
            if (balanceArray.length == 0) {
                balanceSum.innerText = '0'
            } else if (balanceArray.length == 1) {
                balanceSum.innerText = balanceArray[0] / 100000000
            } else {
                for (var i = 0; i < balanceArray.length; i++) {
                    sum += balanceArray[i];
                }
                balanceSum.innerText = sum / 100000000
            }
        })
       
    }
}

function getBalance() {
    var publicKey = document.getElementById("publicKey");

    seeleClient.getBalance(publicKey.value.trim(), function (err, info) {
        var balance = document.getElementById("balance");
        if (err) {
            try {
                var msg = JSON.parse(err.message);
                balance.innerText = msg.error.message;
            } catch (e) {
                balance.innerText = err.message;
            }
        } else {
            balance.innerText = "Balance：" + info.Balance;
        }
    });
}