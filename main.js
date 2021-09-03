/**  Start Global Variables **/
const body = document.body;
const loginBtn = document.querySelector(".btn_login");
const chatScreen = document.querySelector(".chat");
const loginScreen = document.querySelector(".login");
const groupName = document.querySelector(".login .group_name");
const userName = document.querySelector(".login .name");
const logoutBtn = document.querySelector(".logout");
const sendBtn = document.querySelector(".send_message");
const message = document.querySelector(".message");
const chatMessages = document.querySelector(".chat_messages");
const loaderContainer = document.querySelector(".loader_container");
const mainLoader = document.querySelector(".loader_container");
let groupTitle = document.querySelector(".chat .group_name");
let onlineUsersTitle = document.querySelector(".chat .group_users");
let SessionTime = document.querySelector(".session_time span");
let startTimer = null;
let seconds = 60;
let sendingMessageLoader;

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;
let pusher;
let channel;

/** End Global Variables **/

/** Helper functions **/

const pusherSubscription = (channelName) => {
    pusher = new Pusher("cec3490c2affbbc85e27", {
        cluster: "eu",
    });

    // Subscribe on Pusher
    channel = pusher.subscribe(channelName);

    const script = document.createElement("script");
    script.setAttribute("src", "event.js");
    script.setAttribute("class", "pusher_event");
    body.insertAdjacentElement("beforeend", script);
};

const pusherUnsubscription = () => {
    pusher.unsubscribe();
    pusher.disconnect();
    pusher = undefined;
};

const generateId = () => {
    return (
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36)
    );
};

const scrollToBottom = () => {
    chatMessages.scrollTo(0, chatMessages.scrollHeight);
};

const getMD5 = (bodyData) => CryptoJS.MD5(JSON.stringify(bodyData));

const getAuthSignature = (md5, timeStamp) => {
    return CryptoJS.HmacSHA256(
        `POST\n/apps/1257748/events\nauth_key=cec3490c2affbbc85e27&auth_timestamp=${timeStamp}&auth_version=1.0&body_md5=${md5}`,
        "4366ee45c475886eb6f6"
    );
};

const retrieveLocalStorageData = () => {
    const data = JSON.parse(window.localStorage.getItem("data"));
    return data;
};

const stripTextFormat = (event) => {
    let paste = (event.clipboardData || window.clipboardData).getData("text");

    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(paste));

    event.preventDefault();
};

const publishEvent = async (bodyData, event = "") => {
    const timeStamp = Date.now() / 1000;
    const md5 = getMD5(bodyData);
    let url = `https://cors.bridged.cc/https://api-eu.pusher.com/apps/1257748/events?body_md5=${md5}&auth_version=1.0&auth_key=cec3490c2affbbc85e27&auth_timestamp=${timeStamp}&auth_signature=${getAuthSignature(
        md5,
        timeStamp
    )}`;

    if (event === "send-message") {
        message.textContent = "";
        scrollToBottom();
        playLoaderSending();
    }

    try {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        });
    } catch (err) {
        console.log(err);
    }
};

/** Helper Functions **/

/** Start Functions **/

/* Start UI Functionalities */
// Login Validation
const validation = () => {
    let groupNameTemp = groupName.value.trim();
    let userNameTemp = userName.value.trim();
    const validateValue = groupNameTemp && userNameTemp;
    const errors = document.querySelector(".login .errors");

    if (groupNameTemp.includes(" ") || userNameTemp.includes(" ")) {
        errors.classList.remove("hidden");
        return {
            status: false,
            error: "The GroupName & UserName must not contain spaces",
        };
    }

    if (validateValue) {
        errors.classList.add("hidden");
        return { status: true, error: "" };
    }
    errors.classList.remove("hidden");
    return { status: false, error: "You should fill all fields." };
};

const showNextScreen = () => {
    body.classList.add("dark");
    loginScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");

    scrollToBottom();
};

const nextScreen = (e) => {
    e.preventDefault();

    const { status, error } = validation();

    if (!status) {
        const errorsDiv = document.querySelector(".errors");
        errorsDiv.textContent = error;
        return;
    }

    pusherSubscription(groupName.value.trim());
    showNextScreen();

    const id = generateId();
    const data = {
        id,
        name: userName.value.trim(),
        groupName: groupName.value.trim(),
        messages: [],
        onlineUsers: { [id]: userName.value.trim() },
    };
    window.localStorage.setItem("data", JSON.stringify(data));

    // Add New User to online users list
    addToOnlineUsers();

    startInterval(60);

    groupTitle.textContent = groupName.value.trim() + " Group";
    onlineUsersTitle.textContent = 1;
    userName.value = "";
    groupName.value = "";
};

const goHome = () => {
    body.classList.remove("dark");
    loginScreen.classList.remove("hidden");
    chatScreen.classList.add("hidden");
};

const logout = () => {
    removeFromOnlineUsers();
    clearInterval(startTimer);
    window.localStorage.removeItem("data");
    goHome();
    chatMessages.textContent = "";
    message.textContent = "";
    pusherUnsubscription();
};

const loader = () => {
    loaderContainer.classList.add("hidden");
    mainLoader.classList.remove("loader_container");
};

const playLoaderSending = () => {
    const chatWindow = chatMessages.parentElement;
    const lastChild = chatWindow.children.length - 1;
    const { name } = retrieveLocalStorageData();

    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    h2.textContent = "Sending...";
    div.classList.add("sending_loader");
    div.classList.add(name);
    div.append(h2);

    if (chatWindow.children[lastChild].classList.contains("sending_loader")) {
        div.classList.add("hidden");
    }
    chatMessages.parentElement.insertAdjacentElement("beforeend", div);

    sendingMessageLoader = document.getElementsByClassName("sending_loader");
};

/* End UI Functionalities */

/* Start Message Functionalities */
const saveMessages = ({ id, name, message }) => {
    let data = JSON.parse(window.localStorage.getItem("data"));
    let newMessage = { id, name, message };
    data = { ...data, messages: [...data.messages, newMessage] };
    window.localStorage.setItem("data", JSON.stringify(data));
};

const sendMessage = async () => {
    const messageContent = message.innerText.trim();
    if (!messageContent) return;

    const { groupName, name, id } = retrieveLocalStorageData();

    let bodyData = {
        data: JSON.stringify({
            message: messageContent,
            name: name,
            id,
        }),
        name: "send-message",
        channel: groupName,
    };

    publishEvent(bodyData, "send-message");

    saveMessages({ id, name, message: messageContent });

    resetCounter();
};

// Handle Message By clicking Enter
const messageEnter = (e) => {
    if (13 === e.keyCode) {
        if (e.shiftKey) return; // Shift + Enter => To Type a New Line
        sendMessage();
    }
};
const fetchMessage = (dataObj) => {
    const div = document.createElement("div");
    const pUserMessage = document.createElement("p");
    const { id } = retrieveLocalStorageData();

    if (id === dataObj.id) {
        div.classList.add("you");
    } else {
        div.classList.add("user");
        const pUserName = document.createElement("p");
        pUserName.classList.add("user_name");
        pUserMessage.classList.add("user_message");
        pUserName.append(dataObj.name);
        div.append(pUserName);
    }

    div.append(pUserMessage);
    pUserMessage.innerText = dataObj.message;
    chatMessages.appendChild(div);
};

const fetchAllMessages = () => {
    const { messages } = retrieveLocalStorageData();

    messages.forEach((message) => {
        fetchMessage(message);
    });

    scrollToBottom();
};

/* End Message Functionalities */

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

/* Start Counter Functionalities */

const startInterval = (s) => {
    seconds = s;
    startTimer = setInterval(() => {
        timer();
    }, 1000);
};

const timer = () => {
    let minutes = Math.floor(seconds / 60);
    let remSeconds = seconds % 60;

    remSeconds = remSeconds < 10 ? "0" + remSeconds : remSeconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    SessionTime.innerHTML = minutes + ":" + remSeconds;
    if (seconds > 0) {
        seconds = seconds - 1;
    } else {
        clearInterval(startTimer);
        logout();
    }
};

const resetCounter = () => {
    clearInterval(startTimer);
    startInterval(60);
};

/* End Counter Functionalities */

/** End Functions **/

/** Start Events **/
loginBtn.addEventListener("click", nextScreen);
logoutBtn.addEventListener("click", logout);
sendBtn.addEventListener("click", sendMessage);
message.addEventListener("keyup", messageEnter);
message.addEventListener("paste", stripTextFormat);
window.addEventListener("load", loader);

/** End Events **/

if (window.localStorage.getItem("data")) {
    loginScreen.classList.add("hidden");
    // chatMessages.textContent = "";
    const { groupName } = retrieveLocalStorageData();

    pusherSubscription(groupName);
    showNextScreen();
    fetchAllMessages();
    onlineUsersNumber();
    groupTitle.textContent = groupName + " Group";

    startInterval(60);
} else {
    loginScreen.classList.remove("hidden");
}
