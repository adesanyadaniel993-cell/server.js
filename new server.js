{
  "name": "lagos-life",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "ws": "^8.18.0"
  }
}


const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const users = new Map();
const messages = [];

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lagos Life</title>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #07110d;
  color: white;
}

header {
  background: #0c2118;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #193b2b;
}

.logo {
  font-size: 23px;
  font-weight: bold;
}

.balance {
  color: #55e68a;
  font-weight: bold;
}

.container {
  padding: 18px;
  max-width: 900px;
  margin: auto;
}

.card {
  background: #0d1d16;
  border: 1px solid #193b2b;
  border-radius: 15px;
  padding: 18px;
  margin-bottom: 15px;
}

h2 {
  margin-bottom: 15px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  background: #10281d;
  padding: 14px;
  border-radius: 12px;
}

.bar {
  height: 7px;
  background: #1b3829;
  border-radius: 10px;
  margin-top: 8px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #45d87a;
}

.phone {
  background: #101010;
  border: 5px solid #272727;
  border-radius: 35px;
  padding: 18px;
  max-width: 360px;
  margin: auto;
  min-height: 620px;
}

.phone-top {
  text-align: center;
  padding: 10px;
  font-weight: bold;
}

.apps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.app {
  background: #1c1c1c;
  padding: 18px 5px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
}

.app:hover {
  background: #273d31;
}

.icon {
  font-size: 28px;
  margin-bottom: 7px;
}

.chat {
  margin-top: 20px;
}

.messages {
  height: 260px;
  overflow-y: auto;
  background: #080808;
  padding: 10px;
  border-radius: 12px;
}

.message {
  background: #163a27;
  padding: 9px;
  border-radius: 10px;
  margin-bottom: 8px;
}

.message small {
  color: #9baea3;
}

.chat-input {
  display: flex;
  gap: 7px;
  margin-top: 10px;
}

input {
  flex: 1;
  background: #151515;
  border: 1px solid #333;
  color: white;
  padding: 12px;
  border-radius: 10px;
}

button {
  background: #39c96b;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #2da958;
}

.online {
  margin-top: 12px;
}

.person {
  padding: 10px;
  background: #14251d;
  border-radius: 9px;
  margin-bottom: 7px;
}

.status {
  color: #48df7c;
}

.section {
  display: none;
}

.section.active {
  display: block;
}

nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 15px;
}

nav button {
  font-size: 12px;
  padding: 10px 4px;
}
</style>
</head>

<body>

<header>
  <div class="logo">🌴 Lagos Life</div>
  <div class="balance" id="balance">₦1,000,000,000</div>
</header>

<div class="container">

<section id="home" class="section active">

<div class="card">
<h2>Welcome, Pluto 👋</h2>
<p>Level 1 • Lagos City</p>
</div>

<div class="card">
<h2>Your Needs</h2>

<div class="stats">

<div class="stat">
🍔 Hunger
<div class="bar"><div class="fill" style="width:80%"></div></div>
</div>

<div class="stat">
⚡ Energy
<div class="bar"><div class="fill" style="width:70%"></div></div>
</div>

<div class="stat">
🎮 Fun
<div class="bar"><div class="fill" style="width:65%"></div></div>
</div>

<div class="stat">
🧼 Hygiene
<div class="bar"><div class="fill" style="width:90%"></div></div>
</div>

</div>
</div>

<div class="card">
<h2>Quick Actions</h2>

<button onclick="earn(5000)">💼 Work +₦5,000</button>
<button onclick="spend(2000)">🍔 Eat -₦2,000</button>
<button onclick="spend(5000)">🎮 Have Fun -₦5,000</button>

</div>

</section>


<section id="phone" class="section">

<div class="phone">

<div class="phone-top">
📱 Pluto's Phone
</div>

<div class="apps">

<div class="app" onclick="showSection('chat')">
<div class="icon">💬</div>
Messages
</div>

<div class="app" onclick="showSection('online')">
<div class="icon">👥</div>
Lagosians
</div>

<div class="app" onclick="showSection('jobs')">
<div class="icon">💼</div>
Jobs
</div>

<div class="app" onclick="showSection('bank')">
<div class="icon">🏦</div>
Bank
</div>

<div class="app" onclick="showSection('social')">
<div class="icon">📱</div>
Social
</div>

<div class="app" onclick="showSection('map')">
<div class="icon">🗺️</div>
Map
</div>

<div class="app" onclick="showSection('business')">
<div class="icon">🏢</div>
Business
</div>

<div class="app" onclick="showSection('settings')">
<div class="icon">⚙️</div>
Settings
</div>

</div>

</div>

</section>


<section id="chat" class="section">

<div class="card">

<h2>💬 Live Lagos Chat</h2>

<div class="messages" id="messages"></div>

<div class="chat-input">

<input
id="messageInput"
placeholder="Message Lagosians..."
maxlength="300"
/>

<button onclick="sendMessage()">Send</button>

</div>

</div>

</section>


<section id="online" class="section">

<div class="card">

<h2>👥 Lagosians Online</h2>

<div id="users"></div>

</div>

</section>


<section id="jobs" class="section">

<div class="card">

<h2>💼 Jobs</h2>

<div class="person">
<strong>Delivery Rider</strong><br>
Earn ₦15,000
<br><br>
<button onclick="earn(15000)">Work</button>
</div>

<div class="person">
<strong>Tech Freelancer</strong><br>
Earn ₦30,000
<br><br>
<button onclick="earn(30000)">Work</button>
</div>

<div class="person">
<strong>Business Owner</strong><br>
Earn ₦50,000
<br><br>
<button onclick="earn(50000)">Work</button>
</div>

</div>

</section>


<section id="bank" class="section">

<div class="card">

<h2>🏦 Bank</h2>

<h1 id="bankBalance">₦1,000,000,000</h1>

<p>Available game balance</p>

<br>

<button onclick="earn(10000)">Deposit ₦10,000</button>

<button onclick="spend(10000)">Spend ₦10,000</button>

</div>

</section>


<section id="social" class="section">

<div class="card">

<h2>📱 Social</h2>

<div class="person">
<strong>Pluto</strong><br>
Just arrived in Lagos 🌴
</div>

<div class="person">
<strong>Lagos Life</strong><br>
Welcome to the city!
</div>

</div>

</section>


<section id="map" class="section">

<div class="card">

<h2>🗺️ Lagos Map</h2>

<div style="
height:400px;
background:
linear-gradient(rgba(10,30,20,.8),rgba(10,30,20,.8)),
repeating-linear-gradient(
45deg,
#173b29,
#173b29 10px,
#102c20 10px,
#102c20 20px
);
border-radius:15px;
display:flex;
align-items:center;
justify-content:center;
text-align:center;
">

<div>
<h1>🌴 LAGOS</h1>
<p>Victoria Island • Ikeja • Lekki • Yaba • Surulere</p>
</div>

</div>

</div>

</section>


<section id="business" class="section">

<div class="card">

<h2>🏢 Businesses</h2>

<div class="person">
🏪 Mini Mart<br>
Income: ₦8,000/day
<br><br>
<button onclick="earn(8000)">Collect</button>
</div>

<div class="person">
🍔 Restaurant<br>
Income: ₦15,000/day
<br><br>
<button onclick="earn(15000)">Collect</button>
</div>

<div class="person">
💻 Tech Company<br>
Income: ₦30,000/day
<br><br>
<button onclick="earn(30000)">Collect</button>
</div>

</div>

</section>


<section id="settings" class="section">

<div class="card">

<h2>⚙️ Settings</h2>

<p>Username: Pluto</p>
<br>
<p>Location: Lagos</p>
<br>
<p>Account: Game Account</p>

</div>

</section>


<nav>

<button onclick="showSection('home')">🏠 Home</button>
<button onclick="showSection('phone')">📱 Phone</button>
<button onclick="showSection('chat')">💬 Chat</button>
<button onclick="showSection('map')">🗺️ Map</button>

</nav>

</div>


<script>

let balance = Number(localStorage.getItem("balance")) || 1000000000;

function formatMoney(number) {
  return "₦" + number.toLocaleString();
}

function updateBalance() {
  document.getElementById("balance").textContent =
    formatMoney(balance);

  document.getElementById("bankBalance").textContent =
    formatMoney(balance);

  localStorage.setItem("balance", balance);
}

function earn(amount) {
  balance += amount;
  updateBalance();
}

function spend(amount) {

  if (balance < amount) {
    alert("Not enough money.");
    return;
  }

  balance -= amount;
  updateBalance();
}

function showSection(id) {

  document.querySelectorAll(".section")
    .forEach(section => {
      section.classList.remove("active");
    });

  const section = document.getElementById(id);

  if (section) {
    section.classList.add("active");
  }
}

updateBalance();


/* LIVE CHAT */

const protocol =
  location.protocol === "https:" ? "wss://" : "ws://";

const socket =
  new WebSocket(protocol + location.host);

socket.onopen = () => {

  socket.send(JSON.stringify({
    type: "join",
    username: "Pluto"
  }));

};

socket.onmessage = event => {

  const data = JSON.parse(event.data);

  if (data.type === "message") {

    addMessage(
      data.username,
      data.message
    );

  }

  if (data.type === "users") {

    showUsers(data.users);

  }

};

function sendMessage() {

  const input =
    document.getElementById("messageInput");

  const message =
    input.value.trim();

  if (!message) return;

  if (socket.readyState !== WebSocket.OPEN) {

    alert("Chat server is not connected yet.");

    return;

  }

  socket.send(JSON.stringify({

    type: "message",

    username: "Pluto",

    message: message

  }));

  input.value = "";

}

function addMessage(username, message) {

  const box =
    document.getElementById("messages");

  const div =
    document.createElement("div");

  div.className = "message";

  div.innerHTML =
    "<strong>" +
    escapeHTML(username) +
    "</strong><br>" +
    escapeHTML(message);

  box.appendChild(div);

  box.scrollTop = box.scrollHeight;

}

function showUsers(list) {

  const box =
    document.getElementById("users");

  box.innerHTML = "";

  list.forEach(username => {

    const div =
      document.createElement("div");

    div.className = "person";

    div.innerHTML =
      "🟢 <strong>" +
      escapeHTML(username) +
      "</strong>" +
      "<br><span class='status'>Online</span>";

    box.appendChild(div);

  });

}

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}

</script>

</body>
</html>
`;


const server = http.createServer((req, res) => {

  if (req.url === "/" || req.url === "/index.html") {

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end(html);

    return;
  }

  res.writeHead(404);

  res.end("Not found");

});


const wss = new WebSocket.Server({
  server
});


function broadcastUsers() {

  const list = Array.from(users.values());

  const data = JSON.stringify({
    type: "users",
    users: list
  });

  wss.clients.forEach(client => {

    if (client.readyState === WebSocket.OPEN) {

      client.send(data);

    }

  });

}


wss.on("connection", socket => {

  let username = "Guest";

  socket.on("message", raw => {

    try {

      const data =
        JSON.parse(raw.toString());

      if (data.type === "join") {

        username =
          String(data.username || "Guest")
          .substring(0, 30);

        users.set(socket, username);

        broadcastUsers();

        return;
      }


      if (data.type === "message") {

        const message =
          String(data.message || "")
          .trim()
          .substring(0, 300);

        if (!message) return;

        const chatMessage = {

          type: "message",

          username:
            users.get(socket) || "Guest",

          message

        };

        messages.push(chatMessage);

        if (messages.length > 100) {
          messages.shift();
        }

        const output =
          JSON.stringify(chatMessage);

        wss.clients.forEach(client => {

          if (
            client.readyState ===
            WebSocket.OPEN
          ) {

            client.send(output);

          }

        });

      }

    } catch (error) {

      console.log("Invalid message received.");

    }

  });


  socket.on("close", () => {

    users.delete(socket);

    broadcastUsers();

  });

});


server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "Lagos Life running on port " + PORT
    );

  }
);
