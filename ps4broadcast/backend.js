const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const cp = require('child_process');
const fs = require("fs");
const net = require("net");
const path = require('path');
const template = require('art-template');

const modules = [];
const roomModules = {};
const moduleFiles = fs.readdirSync(path.join(__dirname, "/modules"));
for (const mf of moduleFiles) {
  if (mf.indexOf("_") === 0) {
    console.log(mf + " is loaded.");
    modules[modules.length] = require(path.join(__dirname, "/modules/", mf));
  }
  if (mf.indexOf("room_") === 0) {
    console.log(mf + " is loaded as room module.");
    const room_module = require(path.join(__dirname, "/modules/", mf));
    roomModules[room_module.type] = room_module;
  }
}

var _timerHandlers = [];

const openRoom = function (rid, type, webIO, ps4) {
  return new roomModules[type].Init(rid, webIO, ps4, app);
}

class LivingProcess {
  constructor(tid, recordPath, items) {
    this.tid = tid;
    this.rooms = [];
    this.currentTwitchClient = null;
    this.server = null;
    this.recordPath = "";
    this.items = items;
  }

  async setup(tid, recordPath, items) {
    this.tid = tid;
    this.recordPath = recordPath;
    this.items = items;
    await fs.writeFile(
      path.join(__dirname, "lp.data"),
      JSON.stringify({tid: tid, recordPath: recordPath, items: items}),
      {encoding: "utf8", flag: "w", mode: 0o664},
      null
    );
  };

  // TODO: Removed prepare, check if it works
  async configNginxRtmp() {
    try {
      const fileContent = template(path.join(__dirname, "templates/rtmp.conf.d.douyu.art"), {
        recordEnabled: this.recordPath !== null && this.recordPath.trim() !== "",
        recordPath: this.recordPath,
        urls: this.items.map((item) => path.join(item.url, item.code)),
      })
      await fs.writeFile(
        "/usr/local/nginx/conf/rtmp.conf.d/douyu",
        fileContent,
        {encoding: "utf8", flag: "w", mode: 0o664},
        null
      );
    } catch (e) {
      io.emit("error", e.toString());
    }
  }

  async configDanmaku() {
    for (const item of this.items) {
      // TODO: make openRoom async
      this.rooms[this.rooms.length] = openRoom(item.rid, item.type, io, this);
    }
  }

  // TODO: Removed resetTwitchClient, check if it works
  async configTwitchClient() {
    this.server = net.createServer((sock) => {
      console.log("connected");
      this.currentTwitchClient = new TwitchClient(this.tid, sock);
      sock.on("data", (d) => {
        let message = d.toString();
        console.log("Console said: " + message);
        if (message.indexOf("CAP REQ") === 0) {
          this.currentTwitchClient.sendCAP();
        }
        if (message.indexOf("NICK") === 0 || message.indexOf(" PASS") === 0) {
          this.currentTwitchClient.sendHandshake();
        }
      });
      sock.on("close", () => {
        this.currentTwitchClient.close();
      });
      const _handler = setInterval(this.currentTwitchClient.sendPing, 15 * 1000);
      _timerHandlers.push(_handler);
      this.currentTwitchClient.setPinger(_handler);
    });
    try {
      this.server.listen(6667, "0.0.0.0");
    } catch (e) {
      io.emit("error", e.toString());
    }
  }

  async start() {
    try {
      await cp.exec("/usr/local/nginx/sbin/nginx");
    } catch (e) {
      io.emit("error", e.toString());
    }
  }
}

// Set socket.io connections
io.on("connection", (socket) => {
  socket.on("startLive", () => {
    socket.emit("preparingLive", "");
  });

  socket.on("stopLive", () => {
    socket.emit("liveStopped");
  });
});

// Start server
server.listen("26667");
