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
