channel.bind("send-message", function (data) {
    // alert(JSON.stringify(data));
    let dataJson = JSON.stringify(data);
    // alert(dataJson);
    const dataObj = JSON.parse(dataJson);
    const { id } = retrieveLocalStorageData();

    fetchMessage(dataObj);

    saveMessages(dataObj); // Save Message in LocalStorage.

    scrollToBottom();
    if (dataObj.id === id && sendingMessageLoader?.length > 0) {
        sendingMessageLoader[0].remove();
        if (sendingMessageLoader?.length > 0)
            sendingMessageLoader[0].classList.remove("hidden");
    }
});

// Add User to Online Users list.
channel.bind("new-user", (data) => {
    const dataJson = JSON.stringify(data);
    const onlineUserData = JSON.parse(dataJson);
    saveOnlineUsers(onlineUserData.userData);
});

// Remove User from Online users list.
channel.bind("remove-user", (data) => {
    const dataJson = JSON.stringify(data);
    const onlineUserData = JSON.parse(dataJson);
    saveOnlineUsers(onlineUserData.userData, true);
});
