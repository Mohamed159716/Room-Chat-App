/* Start Message Functionalities */
const saveMessages = ({ id, name, message }) => {
    let data = JSON.parse(window.localStorage.getItem("data"));
    let newMessage = { id, name, message };
    console.log(newMessage);
    console.log(data.messages);
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
