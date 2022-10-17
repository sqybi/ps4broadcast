import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from "antd";
import "antd/dist/antd.min.css";
import React, { useState } from "react";
import "./App.css";
import Confirmation from "./Steps/Confirmation";
import DanmakuInfo from "./Steps/DanmakuInfo";
import LiveStatus from "./Steps/LiveStatus";
import PlatformInfo from "./Steps/PlatformInfo";
import TwitchInfo from "./Steps/TwitchInfo";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [twitchId, setTwitchId] = useState("");
  const [platform, setPlatform] = useState("douyu");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamCode, setStreamCode] = useState("");
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [recordingPath, setRecordingPath] = useState("");
  const [danmakuEnabled, setDanmakuEnabled] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [liveStatus, setLiveStatus] = useState("prepare");

  const startLive = () => {
    setLiveStatus("connectPlayStation");
  }

  const moveNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  const movePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      key: "twitch-info",
      title: "配置 Twitch 信息",
      content: (
        <TwitchInfo moveNext={moveNext} twitchId={twitchId} setTwitchId={setTwitchId} />
      ),
    },
    {
      key: "platform-info",
      title: "配置直播平台信息",
      content: (
        <PlatformInfo movePrev={movePrev} moveNext={moveNext}
                      platform={platform} setPlatform={setPlatform}
                      streamUrl={streamUrl} setStreamUrl={setStreamUrl}
                      streamCode={streamCode} setStreamCode={setStreamCode}
                      recordingEnabled={recordingEnabled} setRecordingEnabled={setRecordingEnabled}
                      recordingPath={recordingPath} setRecordingPath={setRecordingPath} />
      ),
    },
    {
      key: "danmaku-info",
      title: "配置弹幕信息",
      content: (
        <DanmakuInfo movePrev={movePrev} moveNext={moveNext}
                     platform={platform}
                     danmakuEnabled={danmakuEnabled} setDanmakuEnabled={setDanmakuEnabled}
                     roomId={roomId} setRoomId={setRoomId} />
      ),
    },
    {
      key: "confirmation",
      title: "确认信息并开始直播",
      content: (
        <Confirmation movePrev={movePrev} moveNext={moveNext} startLive={startLive}
                      twitchId={twitchId} platform={platform} streamUrl={streamUrl} streamCode={streamCode}
                      recordingEnabled={recordingEnabled} recordingPath={recordingPath} danmakuEnabled={danmakuEnabled}
                      roomId={roomId} />
      ),
    },
    {
      key: "live-status",
      title: "直播状态",
      content: (
        <LiveStatus liveStatus={liveStatus} />
      ),
    },
  ];

  return (
    <div className="App">
      <Steps type="navigation" current={currentStep}>
        {steps.map(item => <Steps.Step key={item.key} title={item.title} />)}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
    </div>
  );
}

export default App;
