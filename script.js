// Global variable to store the current theme (default: default)
var currentTheme = "default";

function getThemeColors(theme) {
  let colors = {};
  switch (theme) {
    case "red":
      colors.header = "#d32f2f";
      colors.leftBubble = "#ffe6e6";
      colors.rightBubble = "#d32f2f";
      break;
    case "blue":
      colors.header = "#1976d2";
      colors.leftBubble = "#e3f2fd";
      colors.rightBubble = "#1976d2";
      break;
    case "green":
      colors.header = "#2e7d32";
      colors.leftBubble = "#e8f5e9";
      colors.rightBubble = "#2e7d32";
      break;
    case "dark":
      colors.header = "#222";
      colors.leftBubble = "#bfbfbf";
      colors.rightBubble = "#808080";
      break;
    default:
      colors.header = "#0093a1";
      colors.leftBubble = "#f0f0f0";
      colors.rightBubble = "#0093a1";
      break;
  }
  return colors;
}

function createUserItem({ avatar, name, time }, index) {
  const usrItem = document.createElement("div");
  usrItem.classList.add("usr-item");
  if (index === 0) {
    usrItem.classList.add("active");
  }
  usrItem.innerHTML = `
    <div class="list-item" onclick="showChat(this, ${index})">
      <div class="list-img">
        <img src="${avatar}" alt="${name}" loading="lazy" />
      </div>
      <div class="list-details">
        <div class="list-name">
          <p class="list-title">${name}</p>
          <p class="list-time">${time}</p>
        </div>
        <p class="list-subtext">
          Lorem ipsum dolor sit amet...
        </p>
      </div>
    </div>`;
  document.querySelector(".user-list").appendChild(usrItem);
}

function setUserList(arr) {
  document.querySelector(".user-list").innerHTML = "";
  arr.forEach((item, index) => createUserItem(item, index));
}

setUserList(usersData);

function showChat(element, index) {
  if (window.innerWidth <= 750) {
    document.querySelector(".sidebar").style.display = "none";
    document.querySelector(".chat-area").style.display = "block";
    document.querySelector(".chat-area").style.width = "100%";
  }
  setCurrentUser(element, index);
}

function setCurrentUser(element, index) {
  document.querySelectorAll(".usr-item").forEach(item => item.classList.remove("active"));
  element.parentElement.classList.add("active");
  const name = element.querySelector(".list-title").innerHTML;
  const currentUserData = usersData.filter(item => item.name === name);
  let selectedChat;
  Object.keys(JsonData).forEach((key, i) => {
    if (+key.charAt(key.length - 1) === index + 1) {
      selectedChat = Object.values(JsonData)[i];
    }
  });
  updateChat(currentUserData, selectedChat);
}

function updateChat([{ avatar, name, status }], chat) {
  const profile = document.createElement("div");
  profile.classList.add("user-profile");
  profile.innerHTML = `
    <div class="profile-info">
      <div class="profile-img">
        <span>
          <img src="${avatar}" alt="${name}" />
          <div class="online-indicator"></div>
        </span>
      </div>
      <div class="profile-details">
        <p class="profile-name">${name}</p>
        <p class="profile-role">${status}</p>
      </div>
    </div>`;
  const chatContent = document.querySelector(".chat-content");
  chatContent.innerHTML = "";
  chatContent.appendChild(profile);
  addChatMessages(chat);
}

function addChatMessages(chat) {
  const messagesContainer = document.createElement("div");
  messagesContainer.classList.add("messages");
  const themeColors = getThemeColors(currentTheme);
  if (chat !== undefined) {
    chat.forEach(element => {
      const msgContainer = document.createElement("div");
      const msgPara = document.createElement("p");
      msgPara.innerText = element.msg.message;
      msgContainer.appendChild(msgPara);
      if (element.from.type === "user1") {
        msgContainer.classList.add("msg-left");
        msgPara.classList.add("msg-left-text");
        msgPara.style.backgroundColor = themeColors.leftBubble;
        msgPara.style.color = "#333";
      } else {
        msgContainer.classList.add("msg-right");
        msgPara.classList.add("msg-right-text");
        msgPara.style.backgroundColor = themeColors.rightBubble;
        msgPara.style.color = "#fff";
      }
      messagesContainer.appendChild(msgContainer);
    });
  }
  document.querySelector(".chat-content").appendChild(messagesContainer);
}

function backToList() {
  document.querySelector(".chat-area").style.display = "none";
  document.querySelector(".sidebar").style.display = "block";
  document.querySelector(".sidebar").style.width = "100%";
}

const backBtn = document.querySelector(".btn-back");
if (backBtn) {
  backBtn.addEventListener("click", backToList);
}

window.addEventListener("resize", function () {
  if (window.innerWidth <= 750) {
    document.querySelector(".sidebar").style.display = "block";
    document.querySelector(".sidebar").style.width = "100%";
    document.querySelector(".chat-area").style.display = "none";
  } else {
    document.querySelector(".sidebar").style.width = "32%";
    document.querySelector(".sidebar").style.display = "block";
    document.querySelector(".chat-area").style.width = "68%";
    document.querySelector(".chat-area").style.display = "block";
  }
});

function searchUser(event) {
  const container = document.querySelector(".user-list");
  let input = event.target.value;
  if (input === "") {
    setUserList(usersData);
  } else {
    const newList = usersData.filter(item =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    if (newList.length === 0) {
      container.innerHTML = "No Data Found";
      container.style.fontWeight = "bolder";
    } else {
      setUserList(newList);
    }
  }
}

function changeTheme(event) {
  let theme = event.target.value.toLowerCase();
  if (theme === "change theme") {
    theme = "default";
  }
  currentTheme = theme;
  const themeColors = getThemeColors(theme);
  
  // Use the background property to override any gradients from CSS
  document.querySelector(".side-hdr").style.background = themeColors.header;
  document.querySelector(".menu-btn").style.background = themeColors.header;
  document.querySelector(".chat-area > header").style.background = themeColors.header;
  document.querySelector(".btn-send").style.background = themeColors.header;
  
  document.querySelector(".char-counter").style.color = themeColors.header;
  
  document.querySelectorAll(".msg-left-text").forEach(el => {
    el.style.backgroundColor = themeColors.leftBubble;
    el.style.color = "#333";
  });
  document.querySelectorAll(".msg-right-text").forEach(el => {
    el.style.backgroundColor = themeColors.rightBubble;
    el.style.color = "#fff";
  });
}

function changeBackground(event) {
  let bg = event.target.value;
  let bgUrl;
  switch (bg) {
    case "Change background":
      bgUrl = 'url("https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg")';
      break;
    case "image1":
      bgUrl = 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")';
      break;
    case "image2":
      bgUrl = 'url("https://wallpaperaccess.com/full/1288076.jpg")';
      break;
    case "image3":
      bgUrl = 'url("https://i.pinimg.com/736x/78/1e/21/781e212cb0a891c6d8a3738c525e235d.jpg")';
      break;
    default:
      bgUrl = "";
  }
  const messages = document.querySelector(".messages");
  if (messages) {
    messages.style.backgroundImage = bgUrl;
  }
}

function countText(inputElement) {
  const str = inputElement.value;
  const counter = document.querySelector(".char-counter");
  if (str === "") {
    counter.innerText = `Current characters: 0 and current words: 0`;
  } else {
    const length = str.length;
    const wordCount = str.trim().split(/\s+/).length;
    counter.innerText = `Current characters: ${length} and current words: ${wordCount}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const msgInput = document.querySelector(".msg-input");
  if (msgInput) {
    msgInput.addEventListener("input", function () {
      countText(this);
    });
  }
});

function sendMsg() {
  const msgInput = document.querySelector(".msg-input");
  if (msgInput.value === "") {
    alert("Please Enter Some Text");
  } else {
    const items = document.querySelectorAll(".usr-item");
    let index = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].classList.contains("active")) {
        index = i + 1;
        break;
      }
    }
    let chatKey = `chat${index}`;
    const newMsg = [
      {
        from: { type: "user2" },
        msg: { message: msgInput.value }
      }
    ];
    if (JsonData[chatKey]) {
      JsonData[chatKey] = [...JsonData[chatKey], ...newMsg];
    } else {
      JsonData[chatKey] = newMsg;
    }
    const oldMessages = document.querySelector(".messages");
    if (oldMessages) {
      oldMessages.remove();
    }
    addChatMessages(JsonData[chatKey]);
    msgInput.value = "";
    countText(msgInput);
  }
}
