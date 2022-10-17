import { Button, Col, Input, message, Row, Space, Switch } from "antd";
import React, { useState } from "react";
import { getPlatformReadableName } from "../utils";

function DanmakuInfo(props) {
  const [roomIdInputStatus, setRoomIdInputStatus] = useState(null);

  const handleRoomIdInputCheck = () => {
    if (props.danmakuEnabled && props.roomId.trim() === "") {
      setRoomIdInputStatus("error");
      return false;
    } else {
      setRoomIdInputStatus(null);
      return true;
    }
  };

  const handleMovePrev = () => {
    handleRoomIdInputCheck();
    props.movePrev();
  };

  const handleMoveNext = () => {
    let flag = handleRoomIdInputCheck();
    if (flag) {
      props.moveNext();
    } else {
      message.error("缺少必要的输入，请检查页面上的输入框！");
    }
  };

  return (
    <>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={6}>
          直播平台：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          {getPlatformReadableName(props.platform)}
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={6}>
          开启录制：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          <Switch value={props.danmakuEnabled} onChange={checked => props.setDanmakuEnabled(checked)} />
        </Col>
      </Row>
      {props.danmakuEnabled && (
        <Row className="info-row" align="middle">
          <Col className="tag-col" span={6}>
            直播房间号：
          </Col>
          <Col span={12}>
            <Input allowClear value={props.roomId} status={roomIdInputStatus} onBlur={handleRoomIdInputCheck}
                   onChange={e => props.setRoomId(e.target.value)} />
          </Col>
        </Row>
      )}
      <Row align="middle">
        <Col offset={6} span={12}>
          <Space>
            <Button onClick={handleMovePrev}>
              上一步
            </Button>
            <Button type="primary" onClick={handleMoveNext}>
              下一步
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default DanmakuInfo;
