/* Start Online Users Functionalities*/

const addToOnlineUsers = async (allUsersOnline = null) => {
    const { groupName, name, id } = retrieveLocalStorageData();

    let userData = { [id]: name };

    if (allUsersOnline) userData = allUsersOnline;

    const bodyData = {
        data: JSON.stringify({
            userData,
            status: {
                content: `${name} has joined the group`,
                displayed: false,
            },
        }),
        name: "new-user",
        channel: groupName,
    };

    publishEvent(bodyData);
};

const removeFromOnlineUsers = () => {
    const { groupName, onlineUsers, id } = retrieveLocalStorageData();

    delete onlineUsers[id]; // Delete The user from online users list.

    const bodyData = {
        data: JSON.stringify({
            userData: onlineUsers,
        }),
        name: "remove-user",
        channel: groupName,
    };

    publishEvent(bodyData);
};

const onlineUsersNumber = () => {
    const { onlineUsers } = retrieveLocalStorageData();
    onlineUsersTitle.textContent = Object.keys(onlineUsers).length;
};

const saveOnlineUsers = (userData, logoutUser = false) => {
    let data = JSON.parse(window.localStorage.getItem("data"));

    let onlineUsers = { ...data.onlineUsers, ...userData };
    if (logoutUser) onlineUsers = { ...userData };
    data = {
        ...data,
        onlineUsers: { ...onlineUsers },
    };
    window.localStorage.setItem("data", JSON.stringify(data));
    onlineUsersNumber();

    if (Object.keys(userData).length !== Object.keys(data.onlineUsers).length)
        addToOnlineUsers(data.onlineUsers);
};
/* End Online Users Functionalities*/
