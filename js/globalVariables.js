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
