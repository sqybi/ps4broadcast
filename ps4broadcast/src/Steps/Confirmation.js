import { Button, Col, message, Row, Space } from "antd";
import React from "react";
import { getPlatformReadableName } from "../utils";

function Confirmation(props) {
  const handleMovePrev = () => {
    props.movePrev();
  };

  const handleLiveStart = () => {
    props.moveNext();
    props.startLive();
  };

  return (
    <>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={12}>
          Twitch 用户名：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {props.twitchId}
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={12}>
          直播平台：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {getPlatformReadableName(props.platform)}
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={12}>
          推流地址：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {props.streamUrl}
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={12}>
          推流码 / 直播密钥：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {props.streamCode}
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={12}>
          录制存储地址：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {props.recordingEnabled ? props.recordingPath : "未开启录制"}
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={12}>
          弹幕房间号：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {props.danmakuEnabled ? props.roomId : "未开启弹幕"}
        </Col>
      </Row>
      <Row align="middle">
        <Col offset={6} span={12}>
          <Space>
            <Button onClick={handleMovePrev}>
              上一步
            </Button>
            <Button type="primary" onClick={handleLiveStart}>
              确认信息无误，开始直播！
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default Confirmation;
