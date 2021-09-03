/** Helper functions **/

const pusherSubscription = (channelName) => {
    pusher = new Pusher("cec3490c2affbbc85e27", {
        cluster: "eu",
    });

    // Subscribe on Pusher
    channel = pusher.subscribe(channelName);

    const script = document.createElement("script");
    script.setAttribute("src", "js/pusherEvents.js");
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
