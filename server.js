const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lagos Life</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:Arial}
body{background:#0e1511;color:white}
#app{max-width:520px;margin:auto;min-height:100vh;background:#18221c;padding-bottom:75px}
header{height:62px;background:#101711;display:flex;justify-content:space-between;align-items:center;padding:0 15px;position:sticky;top:0;z-index:5}
.logo{font-size:20px;font-weight:bold}
.balance{background:#27352b;padding:9px 12px;border-radius:20px;color:#dfff72}
.page{display:none;padding:15px}
.page.active{display:block}
.card{background:#222d26;border:1px solid #344238;border-radius:17px;padding:16px;margin-bottom:12px}
.title{font-size:22px;font-weight:bold;margin-bottom:14px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
button{border:0;border-radius:11px;padding:11px 14px;font-weight:bold;cursor:pointer}
.green{background:#dfff72;color:#172019}
.dark{background:#303d34;color:white}
.bottom{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:min(520px,100%);height:70px;background:#101711;display:grid;grid-template-columns:repeat(5,1fr);z-index:10}
.nav{background:none;color:#89958d;border-radius:0}
.nav.active{color:#dfff72}
.nav div{font-size:21px}
.phone{background:#080d09;border:5px solid #303932;border-radius:30px;overflow:hidden;min-height:570px;box-shadow:0 15px 40px #0008}
.phoneTop{height:35px;background:#111812;text-align:center;padding:9px;font-size:11px}
.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:25px 18px}
.appIcon{text-align:center;font-size:12px}
.icon{width:58px;height:58px;margin:auto;background:#26332a;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:5px}
.chat{height:390px;background:#121a15;overflow:auto;padding:12px}
.msg{background:#29362e;border-radius:13px;padding:10px;margin:7px 0;max-width:80%;font-size:13px}
.me{margin-left:auto;background:#dfff72;color:#172019}
.chatInput{display:flex;gap:7px;padding:9px;background:#101711}
.chatInput input{flex:1}
input{background:#111812;border:1px solid #354238;color:white;padding:12px;border-radius:10px;outline:none}
.online{color:#a8bdad;font-size:12px;margin-bottom:12px}
.player{background:#222d26;border:1px solid #344238;padding:12px;border-radius:12px;margin:7px 0;display:flex;justify-content:space-between;align-items:center}
#phoneScreen{display:none}
</style>
</head>

<body>

<div id="app">

<header>
<div class="logo">🌆 LAGOS LIFE</div>
<div class="balance" id="money">₦1,000,000,000</div>
</header>

<section id="home" class="page active">
<div class="title">Good morning, Pluto 👋</div>

<div class="card">
<h3>📍 Mushin, Lagos</h3>
<p style="color:#9aa69e;margin-top:6px">Level 1 • New Lagosian</p>
</div>

<div class="card">
<h3>Life</h3><br>
<div class="grid">
<button class="dark" onclick="action('🍛 Eat')">🍛 Eat</button>
<button class="dark" onclick="action('🛏️ Sleep')">🛏️ Sleep</button>
<button class="dark" onclick="action('🚿 Shower')">🚿 Shower</button>
<button class="dark" onclick="action('🎮 Relax')">🎮 Relax</button>
</div>
</div>

<div class="card">
<h3>📱 Your Phone</h3>
<p style="color:#9aa69e;margin:7px 0 13px">Talk to other Lagosians, use social apps and manage your virtual life.</p>
<button class="green" onclick="openPhone()">Open Phone</button>
</div>
</section>

<section id="phone" class="page">

<div class="phone">

<div class="phoneTop">
9:41 • 📶 5G • 🔋 87%
</div>

<div id="phoneHome">

<div style="padding:18px 18px 0;font-size:20px;font-weight:bold">
Lagos Phone
</div>

<div class="apps">

<div class="appIcon" onclick="showApp('chatApp')">
<div class="icon">💬</div>
Messages
</div>

<div class="appIcon" onclick="showApp('peopleApp')">
<div class="icon">👥</div>
Lagosians
</div>

<div class="appIcon" onclick="showApp('jobsApp')">
<div class="icon">💼</div>
Jobs
</div>

<div class="appIcon" onclick="showApp('bankApp')">
<div class="icon">🏦</div>
Bank
</div>

<div class="appIcon" onclick="showApp('socialApp')">
<div class="icon">📸</div>
Social
</div>

<div class="appIcon" onclick="showApp('mapApp')">
<div class="icon">🗺️</div>
Map
</div>

<div class="appIcon" onclick="showApp('businessApp')">
<div class="icon">🏪</div>
Business
</div>

<div class="appIcon" onclick="showApp('settingsApp')">
<div class="icon">⚙️</div>
Settings
</div>

</div>

</div>

<div id="chatApp" style="display:none">

<div style="padding:13px;background:#111812;display:flex;justify-content:space-between">
<b>💬 Messages</b>
<button class="dark" onclick="phoneHome()">←</button>
</div>

<div class="chat" id="messages">
<div class="msg">System: Welcome to Lagos Life Live Chat.</div>
</div>

<div class="chatInput">
<input id="messageInput" placeholder="Message Lagosians..." onkeydown="if(event.key==='Enter')sendMessage()">
<button class="green" onclick="sendMessage()">➤</button>
</div>

</div>

<div id="peopleApp" style="display:none;padding:15px">

<button class="dark" onclick="phoneHome()">← Back</button>

<h2 style="margin:15px 0 5px">👥 Lagosians Online</h2>

<div class="online" id="onlineCount">
Connecting...
</div>

<div id="players"></div>

</div>

<div id="jobsApp" style="display:none;padding:15px">
<button class="dark" onclick="phoneHome()">← Back</button>
<h2 style="margin:15px 0">💼 Jobs</h2>
<div class="player">Driver <button class="green" onclick="earn(8500)">Work ₦8,500</button></div>
<div class="player">Tech Assistant <button class="green" onclick="earn(14000)">Work ₦14,000</button></div>
<div class="player">Banking <button class="green" onclick="earn(11600)">Work ₦11,600</button></div>
<div class="player">Business Manager <button class="green" onclick="earn(25000)">Work ₦25,000</button></div>
</div>

<div id="bankApp" style="display:none;padding:15px">
<button class="dark" onclick="phoneHome()">← Back</button>
<h2 style="margin:15px 0">🏦 My Bank</h2>
<div class="card">
<p>Available Balance</p>
<h2 id="bankBalance">₦1,000,000,000</h2>
</div>
<button class="green" onclick="earn(50000)">Receive ₦50,000</button>
</div>

<div id="socialApp" style="display:none;padding:15px">
<button class="dark" onclick="phoneHome()">← Back</button>
<h2 style="margin:15px 0">📸 Lagos Social</h2>
<div class="card">
<b>Pluto</b>
<p style="color:#9aa69e;margin-top:7px">Living life in Lagos 🌆</p>
</div>
<div class="card">
<b>Trending Lagos</b>
<p style="color:#9aa69e;margin-top:7px">#LagosLife #Mushin #Naija</p>
</div>
</div>

<div id="mapApp" style="display:none;padding:15px">
<button class="dark" onclick="phoneHome()">← Back</button>
<h2 style="margin:15px 0">🗺️ Lagos Map</h2>
<div class="card" style="height:330px;background:#1d3025;position:relative">
<div style="position:absolute;top:25%;left:15%">📍 Mushin</div>
<div style="position:absolute;top:15%;right:15%">📍 Ikeja</div>
<div style="position:absolute;bottom:20%;left:20%">📍 Yaba</div>
<div style="position:absolute;bottom:15%;right:18%">📍 Lekki</div>
</div>
</div>

<div id="businessApp" style="display:none;padding:15px">
<button class="dark" onclick="phoneHome()">← Back</button>
<h2 style="margin:15px 0">🏪 Business</h2>
<div class="player">Mini Shop <button class="green" onclick="earn(7000)">Operate</button></div>
<div class="player">Restaurant <button class="green" onclick="earn(15000)">Operate</button></div>
<div class="player">Tech Store <button class="green" onclick="earn(22000)">Operate</button></div>
</div>

<div id="settingsApp" style="display:none;padding:15px">
<button class="dark" onclick="phoneHome()">← Back</button>
<h2 style="margin:15px 0">⚙️ Settings</h2>
<div class="card">Username: Pluto</div>
<div class="card">Location: Lagos, Nigeria</div>
<div class="card">Connection: <span id="connection">Connecting...</span></div>
</div>

</div>

<button class="dark" style="margin-top:15px" onclick="openPage('home')">← Exit Phone</button>

</section>

<div class="bottom">
<button class="nav active" onclick="openPage('home')"><div>⌂</div>Home</button>
<button class="nav" onclick="openPhone()"><div>📱</div>Phone</button>
<button class="nav" onclick="showAppDirect('peopleApp')"><div>👥</div>People</button>
<button class="nav" onclick="showAppDirect('jobsApp')"><div>💼</div>Jobs</button>
<button class="nav" onclick="showAppDirect('mapApp')"><div>🗺️</div>Map</button>
</div>

</div>

<script>

let balance=1000000000;

let socket;

let username="Pluto";

function money(n){
return "₦"+Number(n).toLocaleString("en-NG");
}

function updateMoney(){
document.getElementById("money").textContent=money(balance);
document.getElementById("bankBalance").textContent=money(balance);
}

function action(name){
alert(name+" completed!");
}

function earn(amount){
balance+=amount;
updateMoney();
}

function openPage(id){
document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

function openPhone(){
openPage("phone");
phoneHome();
}

function phoneHome(){
document.getElementById("phoneHome").style.display="block";

[
"chatApp",
"peopleApp",
"jobsApp",
"bankApp",
"socialApp",
"mapApp",
"businessApp",
"settingsApp"
].forEach(id=>{
document.getElementById(id).style.display="none";
});
}

function showApp(id){
document.getElementById("phoneHome").style.display="none";

[
"chatApp",
"peopleApp",
"jobsApp",
"bankApp",
"socialApp",
"mapApp",
"businessApp",
"settingsApp"
].forEach(x=>{
document.getElementById(x).style.display="none";
});

document.getElementById(id).style.display="block";
}

function showAppDirect(id){
openPhone();
showApp(id);
}

function connect(){

socket=new WebSocket(
(location.protocol==="https:"?"wss://":"ws://")+location.host
);

socket.onopen=()=>{
document.getElementById("connection").textContent="🟢 Online";
};

socket.onclose=()=>{
document.getElementById("connection").textContent="🔴 Offline";
};

socket.onmessage=(event)=>{

let data=JSON.parse(event.data);

if(data.type==="message"){

let box=document.getElementById("messages");

let msg=document.createElement("div");

msg.className=data.user===username?"msg me":"msg";

msg.innerHTML="<b>"+escapeHTML(data.user)+"</b><br>"+escapeHTML(data.text);

box.appendChild(msg);

box.scrollTop=box.scrollHeight;

}

if(data.type==="users"){

document.getElementById("onlineCount").textContent=
data.users.length+" Lagosian(s) online";

let players=document.getElementById("players");

players.innerHTML="";

data.users.forEach(user=>{

let div=document.createElement("div");

div.className="player";

div.innerHTML=
"<span>🟢 "+escapeHTML(user)+"</span>"+
"<button class='green' onclick='privateMessage("+JSON.stringify(user)+")'>Chat</button>";

players.appendChild(div);

});

}

};

}

function sendMessage(){

let input=document.getElementById("messageInput");

let text=input.value.trim();

if(!text||!socket||socket.readyState!==1)return;

socket.send(JSON.stringify({
type:"message",
user:username,
text:text
}));

input.value="";

}

function privateMessage(user){

showApp("chatApp");

let input=document.getElementById("messageInput");

input.value="@"+user+" ";

input.focus();

}

function escapeHTML(text){

return text
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}

updateMoney();

connect();

</script>

</body>
</html>
`;

const server=http.createServer((req,res)=>{
res.writeHead(200,{"Content-Type":"text/html"});
res.end(html);
});

const wss=new WebSocket.Server({server});

const clients=new Map();

wss.on("connection",(ws)=>{

let username="Lagosian";

ws.on("message",(raw)=>{

try{

const data=JSON.parse(raw.toString());

if(data.type==="message"){

username=data.user||"Lagosian";

for(const client of wss.clients){

if(client.readyState===WebSocket.OPEN){

client.send(JSON.stringify({
type:"message",
user:username,
text:data.text
}));

}

}

broadcastUsers();

}

}catch(e){}

});

ws.on("close",()=>{
clients.delete(ws);
broadcastUsers();
});

clients.set(ws,username);

broadcastUsers();

});

function broadcastUsers(){

const users=[...clients.entries()].map(([ws,name])=>name);

for(const client of wss.clients){

if(client.readyState===WebSocket.OPEN){

client.send(JSON.stringify({
type:"users",
users:[...new Set(users)]
}));

}

}

}

server.listen(PORT,()=>{
console.log("Lagos Life running on port "+PORT);
});
