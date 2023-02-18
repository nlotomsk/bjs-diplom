"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => {
    const cb = (response) => {
        if (response.success) {
            location.reload();
        }
    }
    ApiConnector.logout(cb);
}
ApiConnector.current((response) => {
    if (response.success){
        ProfileWidget.showProfile(response.data);
    }
})

const ratesBoards = new RatesBoard();

const updateRatesBoards = () => {
    ApiConnector.getStocks((response) => {
        if(response.success) {
            ratesBoards.clearTable();
            ratesBoards.fillTable(response.data);
        }
    })
}

updateRatesBoards();

setInterval(() => {
    updateRatesBoards();
},1000*60);

const moneyManager = new MoneyManager();

const checkStatus = (data, response, message) => {
    //const {amount,currency} = data;
    if(response.success){
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success,message);
    } else {
        moneyManager.setMessage(response.success,response.error);
    }
}

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        const message = `Баланс пополнен на ${data.amount} ${data.currency}`;
        checkStatus(data, response, message);
    });
}

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        const message = `Баланс пополнен на ${data.fromAmount} ${data.targetCurrency}`;
        checkStatus(data, response, message);
    })
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        const message = `Перевод ${data.amount} ${data.currency } пользователю ID ${data.to}`;
        checkStatus(data, response, message);
    })
}

const favoritesWidget = new FavoritesWidget();


const getCurrentDataList = (response) => {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
}

ApiConnector.getFavorites(response => {
    if(response.success){
        getCurrentDataList(response);
    }
})

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if(response.success){
            getCurrentDataList(response);
            favoritesWidget.setMessage(response.success, `${data.name} добавлен`);
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    })
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if(response.success){
            getCurrentDataList(response);
            favoritesWidget.setMessage(response.success, `ID ${data} удален`);
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    })
}