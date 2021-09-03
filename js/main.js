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
