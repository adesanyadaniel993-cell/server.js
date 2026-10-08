const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3000;

let balance = 1000000000;
let users = new Set();
let messages = [];

const clients = new Set();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lagos Life</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;background:#06100b;color:white}
header{background:#0c2118;padding:18px;display:flex;justify-content:space-between;border-bottom:1px solid #234533}
.logo{font-size:22px;font-weight:bold}.money{color:#55e68a;font-weight:bold}
.container{max-width:850px;margin:auto;padding:18px}
.card{background:#0d1d16;border:1px solid #234533;border-radius:16px;padding:18px;margin-bottom:15px}
h2{margin-bottom:15px}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.stat{background:#10281d;padding:14px;border-radius:12px}
.bar{height:7px;background:#1b3829;border-radius:10px;margin-top:8px}
.fill{height:100%;background:#45d87a;border-radius:10px}
button{background:#39c96b;color:white;border:0;padding:12px 15px;border-radius:10px;font-weight:bold;margin:4px;cursor:pointer}
button:hover{background:#2da958}
.phone{background:#101010;border:5px solid #292929;border-radius:35px;padding:18px;max-width:360px;min-height:590px;margin:auto}
.phone-top{text-align:center;padding:10px;font-weight:bold}
.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}
.app{background:#1b1b1b;padding:17px 5px;border-radius:15px;text-align:center;cursor:pointer}
.app:hover{background:#294333}
.icon{font-size:27px;margin-bottom:6px}
.section{display:none}.section.active{display:block}
.messages{height:270px;overflow-y:auto;background:#080808;padding:10px;border-radius:12px}
.message{background:#163a27;padding:10px;border-radius:10px;margin-bottom:8px}
.message small{color:#9aa99f}
.chat-input{display:flex;gap:6px;margin-top:10px}
input{flex:1;background:#151515;border:1px solid #333;color:white;padding:12px;border-radius:10px}
.person{background:#14251d;padding:12px;border-radius:10px;margin-bottom:8px}
nav{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:15px}
nav button{font-size:12px;padding:10px 4px}
.map{height:350px;border-radius:15px;background:repeating-linear-gradient(45deg,#173b29,#173b29 12px,#102c20 12px,#102c20 24px);display:flex;align-items:center;justify-content:center;text-align:center}
</style>
</head>

<body>

<header>
<div class="logo">🌴 Lagos Life</div>
<div class="money" id="money">₦1,000,000,000</div>
</header>

<div class="container">

<div id="home" class="section active">

<div class="card">
<h2>Welcome, Pluto 👋</h2>
<p>Level 1 • Lagos City</p>
</div>

<div class="card">
<h2>Your Needs</h2>
<div class="stats">
<div class="stat">🍔 Hunger<div class="bar"><div class="fill" style="width:80%"></div></div></div>
<div class="stat">⚡ Energy<div class="bar"><div class="fill" style="width:70%"></div></div></div>
<div class="stat">🎮 Fun<div class="bar"><div class="fill" style="width:65%"></div></div></div>
<div class="stat">🧼 Hygiene<div class="bar"><div class="fill" style="width:90%"></div></div></div>
</div>
</div>

<div class="card">
<h2>Quick Actions</h2>
<button onclick="earn(5000)">💼 Work +₦5,000</button>
<button onclick="spend(2000)">🍔 Eat -₦2,000</button>
<button onclick="spend(5000)">🎮 Fun -₦5,000</button>
</div>

</div>

<div id="phone" class="section">

<div class="phone">
<div class="phone-top">📱 Pluto's Phone</div>

<div class="apps">
<div class="app" onclick="show('chat')"><div class="icon">💬</div>Messages</div>
<div class="app" onclick="show('people')"><div class="icon">👥</div>Lagosians</div>
<div class="app" onclick="show('jobs')"><div class="icon">💼</div>Jobs</div>
<div class="app" onclick="show('bank')"><div class="icon">🏦</div>Bank</div>
<div class="app" onclick="show('social')"><div class="icon">📱</div>Social</div>
<div class="app" onclick="show('map')"><div class="icon">🗺️</div>Map</div>
<div class="app" onclick="show('business')"><div class="icon">🏢</div>Business</div>
<div class="app" onclick="show('settings')"><div class="icon">⚙️</div>Settings</div>
</div>
</div>

</div>

<div id="chat" class="section">
<div class="card">
<h2>💬 Live Lagos Chat</h2>
<div class="messages" id="messages"></div>
<div class="chat-input">
<input id="msg" maxlength="300" placeholder="Message Lagosians...">
<button onclick="sendMessage()">Send</button>
</div>
</div>
</div>

<div id="people" class="section">
<div class="card">
<h2>👥 Lagosians Online</h2>
<div id="users"></div>
</div>
</div>

<div id="jobs" class="section">
<div class="card">
<h2>💼 Jobs</h2>
<div class="person">🚚 Delivery Rider<br>Earn ₦15,000<br><button onclick="earn(15000)">Work</button></div>
<div class="person">💻 Tech Freelancer<br>Earn ₦30,000<br><button onclick="earn(30000)">Work</button></div>
<div class="person">🏢 Business Owner<br>Earn ₦50,000<br><button onclick="earn(50000)">Work</button></div>
</div>
</div>

<div id="bank" class="section">
<div class="card">
<h2>🏦 Bank</h2>
<h1 id="bankMoney">₦1,000,000,000</h1>
<br>
<button onclick="earn(10000)">Deposit ₦10,000</button>
<button onclick="spend(10000)">Spend ₦10,000</button>
</div>
</div>

<div id="social" class="section">
<div class="card">
<h2>📱 Social</h2>
<div class="person"><b>Pluto</b><br>Just arrived in Lagos 🌴</div>
<div class="person"><b>Lagos Life</b><br>Welcome to the city!</div>
</div>
</div>

<div id="map" class="section">
<div class="card">
<h2>🗺️ Lagos Map</h2>
<div class="map">
<div><h1>🌴 LAGOS</h1><br>Victoria Island • Ikeja • Lekki • Yaba • Surulere</div>
</div>
</div>
</div>

<div id="business" class="section">
<div class="card">
<h2>🏢 Businesses</h2>
<div class="person">🏪 Mini Mart<br>Income ₦8,000/day<br><button onclick="earn(8000)">Collect</button></div>
<div class="person">🍔 Restaurant<br>Income ₦15,000/day<br><button onclick="earn(15000)">Collect</button></div>
<div class="person">💻 Tech Company<br>Income ₦30,000/day<br><button onclick="earn(30000)">Collect</button></div>
</div>
</div>

<div id="settings" class="section">
<div class="card">
<h2>⚙️ Settings</h2>
<p>Username: Pluto</p><br>
<p>Location: Lagos</p><br>
<p>Account: Game Account</p>
</div>
</div>

<nav>
<button onclick="show('home')">🏠 Home</button>
<button onclick="show('phone')">📱 Phone</button>
<button onclick="show('chat')">💬 Chat</button>
<button onclick="show('map')">🗺️ Map</button>
</nav>

</div>

<script>

let money = Number(localStorage.getItem("lagosMoney")) || 1000000000;

function moneyText(n){
return "₦" + n.toLocaleString();
}

function updateMoney(){
document.getElementById("money").textContent=moneyText(money);
document.getElementById("bankMoney").textContent=moneyText(money);
localStorage.setItem("lagosMoney",money);
}

function earn(amount){
money += amount;
updateMoney();
}

function spend(amount){
if(money < amount){
alert("Not enough money.");
return;
}
money -= amount;
updateMoney();
}

function show(id){
document.querySelectorAll(".section").forEach(x=>x.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

function safe(text){
let d=document.createElement("div");
d.textContent=text;
return d.innerHTML;
}

function addMessage(username,message){

let box=document.getElementById("messages");

let div=document.createElement("div");
div.className="message";

div.innerHTML="<b>"+safe(username)+"</b><br>"+safe(message);

box.appendChild(div);

box.scrollTop=box.scrollHeight;
}

function loadChat(){

fetch("/api/messages")
.then(r=>r.json())
.then(data=>{

document.getElementById("messages").innerHTML="";

data.forEach(x=>{
addMessage(x.username,x.message);
});

});
}

function sendMessage(){

let input=document.getElementById("msg");
let message=input.value.trim();

if(!message)return;

fetch("/api/message",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
username:"Pluto",
message:message
})
})
.then(()=>{

input.value="";
loadChat();

});

}

function loadUsers(){

fetch("/api/users")
.then(r=>r.json())
.then(data=>{

let box=document.getElementById("users");
box.innerHTML="";

data.forEach(name=>{

let div=document.createElement("div");
div.className="person";

div.innerHTML="🟢 <b>"+safe(name)+"</b><br><small>Online</small>";

box.appendChild(div);

});

});

}

function join(){

fetch("/api/join",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username:"Pluto"})
});

}

updateMoney();
join();
loadChat();
loadUsers();

setInterval(loadChat,2000);
setInterval(loadUsers,3000);

document.getElementById("msg").addEventListener("keydown",function(e){
if(e.key==="Enter")sendMessage();
});

</script>

</body>
</html>`;


function sendJSON(res, data, status = 200) {

res.writeHead(status, {
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*"
});

res.end(JSON.stringify(data));

}


function readBody(req) {

return new Promise((resolve) => {

let body = "";

req.on("data", chunk => {

body += chunk;

if(body.length > 10000) {
req.destroy();
}

});

req.on("end", () => {

try {
resolve(JSON.parse(body || "{}"));
}
catch {
resolve({});
}

});

});

}


const server = http.createServer(async (req,res) => {

const parsed = url.parse(req.url,true);

if(req.method === "GET" && parsed.pathname === "/"){

res.writeHead(200, {
"Content-Type":"text/html; charset=utf-8"
});

res.end(html);

return;
}


if(req.method === "GET" && parsed.pathname === "/api/messages"){

sendJSON(res,messages);

return;
}


if(req.method === "GET" && parsed.pathname === "/api/users"){

sendJSON(res,Array.from(users));

return;
}


if(req.method === "POST" && parsed.pathname === "/api/join"){

const body = await readBody(req);

const username = String(body.username || "Guest")
.substring(0,30);

users.add(username);

sendJSON(res,{success:true});

return;
}


if(req.method === "POST" && parsed.pathname === "/api/message"){

const body = await readBody(req);

const username = String(body.username || "Guest")
.substring(0,30);

const message = String(body.message || "")
.trim()
.substring(0,300);

if(!message){

sendJSON(res,{success:false},400);

return;
}

users.add(username);

messages.push({
username:username,
message:message,
time:Date.now()
});

if(messages.length > 100){
messages.shift();
}

sendJSON(res,{success:true});

return;
}


res.writeHead(404,{"Content-Type":"text/plain"});
res.end("Not Found");

});


server.listen(PORT,"0.0.0.0",() => {

console.log("Lagos Life running on port " + PORT);

});
