import template from "art-template";
import cp from "child_process";
import express from "express";
import { promises as fs } from "fs";
import http from "http";
import net from "net";
import path from "path";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const modules = [];
const roomModules = {};
const moduleFiles = await fs.readdir(path.join(__dirname, "/modules"));
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

const openRoom = function (rid, type, webIO, ps4) {
  return new roomModules[type].Init(rid, webIO, ps4, app);
}

const log = (type, message, exception) => {
  io.emit(type, message, exception);
}

const logWarning = (message, exception) => {
  log("warning", message, exception);
}
const logWarn = logWarning;

const logError = (message, exception) => {
  log("error", message, exception);
}

class FakeTwitchSocketForPS4 {
  constructor(twitchId) {
    this.twitchId = twitchId;
    this.heartbeatIntervalId = null;
    this.socket = null;
    this.server = net.createServer((twitchSocket) => {
      if (this.socket) {
        console.log("Duplicated connections from PS4, ignored...");
        return;
      }
      this.socket = twitchSocket;
      twitchSocket.on("data", (d) => {
        let message = d.toString();
        if (message.indexOf("CAP REQ") === 0) {
          this.sendCAP();
        }
        if (message.indexOf("NICK") === 0 || message.indexOf(" PASS") === 0) {
          this.sendHandshake();
        }
      });
      twitchSocket.on("close", () => {
        this.close();
      });
    });
  }

  open() {
    if (this.socket) {
      logWarn("Twitch socket already running.", null);
      return;
    }
    try {
      this.server.listen(6667, "0.0.0.0");
      this.heartbeatIntervalId = setInterval(this.sendPing, 15 * 1000);
    } catch (e) {
      logError("Cannot start twitch socket.", e);
    }
  }

  close() {
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }
    this.server.close();
    this.socket = null;
  }

  // TODO: old name = toPS4
  sendDanmaku(name, message) {
    try {
      this.socket.write(`:${name}!${name}@${name}.tmi.twitch.tv PRIVMSG #${name} :${message}\r\n`);
    } catch (e) {
      logError("Twitch socket failed to send danmaku.", e);
    }
  };

  sendHandshake() {
    try {
      this.socket.write(`:tmi.twitch.tv 001 ${this.twitchId} :Welcome, GLHF!\r\n`);
      this.socket.write(`:tmi.twitch.tv 002 ${this.twitchId} :Your host is tmi.twitch.tv\r\n`);
      this.socket.write(`:tmi.twitch.tv 003 ${this.twitchId} :This server is rather new\r\n`);
      this.socket.write(`:tmi.twitch.tv 004 ${this.twitchId} :-\r\n`);
      this.socket.write(`:tmi.twitch.tv 375 ${this.twitchId} :-\r\n`);
      this.socket.write(`:tmi.twitch.tv 372 ${this.twitchId} :You are in a maze of twisty passages, all alike.\r\n`);
      this.socket.write(`:tmi.twitch.tv 376 ${this.twitchId} :>\r\n`);
      this.socket.write("\r\n");
    } catch (e) {
      logError("Twitch socket failed to send handshake.", e);
    }
  }

  sendPing() {
    try {
      this.socket.write("PING :tmi.twitch.tv\r\n");
    } catch (e) {
      logError("Twitch socket failed to send ping.", e);
    }
  }

  sendCAP() {
    try {
      this.socket.write(":tmi.twitch.tv CAP * ACK :twitch.tv/tags\r\n");
    } catch (e) {
      logError("Twitch socket failed to send CAP.", e);
    }
  }
}

class LivingProcess {
  constructor() {
    this.tid = null;
    this.recordPath = null;
    this.items = null;
    this.rooms = [];
    this.currentTwitchClient = null;
  }

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
        {encoding: "utf8", flag: "w", mode: 0o664}
      );
    } catch (e) {
      io.emit("error", e.toString());
    }
  }

  async configDanmaku() {
    for (const item of this.items) {
      this.rooms[this.rooms.length] = openRoom(item.rid, item.type, io, this);
    }
  }

  // TODO: Removed resetTwitchClient, check if it works
  async configTwitchClient() {
    this.currentTwitchClient = new FakeTwitchSocketForPS4(this.tid);
    this.currentTwitchClient.open();
  }

  async startNginx() {
    try {
      await cp.exec("/usr/local/nginx/sbin/nginx");
    } catch (e) {
      io.emit("error", e.toString());
    }
  }

  async start(tid, recordPath, items) {

  }

  async stop() {

  }
}

// Set socket.io connections
io.on("connection", async (socket) => {
  try {
    socket.emit(
      "lastConfig",
      JSON.parse(await fs.readFile(path.join(__dirname, "/lp.data"), {encoding: "utf8"}))
    );
  } catch (e) {
  }

  socket.on("startLive", async (tid, recordPath, items) => {
    await fs.writeFile(
      path.join(__dirname, "lp.data"),
      JSON.stringify({tid: tid, recordPath: recordPath, items: items}),
      {encoding: "utf8", flag: "w", mode: 0o664}
    );
    io.emit("preparingLive", "");
  });

  socket.on("stopLive", async () => {
    io.emit("liveStopped");
  });
});

// Start server
server.listen("26667");
