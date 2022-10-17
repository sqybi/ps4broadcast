import { Button, Col, Input, message, Row, Select, Space, Switch } from "antd";
import React, { useState } from "react";
import { getPlatformReadableName } from "../utils";

function PlatformInfo(props) {
  const [streamUrlInputStatus, setStreamUrlInputStatus] = useState(null);
  const [recordingPathInputStatus, setRecordingPathInputStatus] = useState(null);

  const handleStreamUrlInputCheck = () => {
    if (props.streamUrl.trim() === "") {
      setStreamUrlInputStatus("error");
      return false;
    } else {
      setStreamUrlInputStatus(null);
      return true;
    }
  };

  const handleRecordingPathInputCheck = () => {
    if (props.recordingEnabled && props.recordingPath.trim() === "") {
      setRecordingPathInputStatus("error");
      return false;
    } else {
      setRecordingPathInputStatus(null);
      return true;
    }
  };

  const handleMovePrev = () => {
    handleStreamUrlInputCheck();
    props.movePrev();
  };

  const handleMoveNext = () => {
    let flag = handleStreamUrlInputCheck();
    flag = handleRecordingPathInputCheck() && flag;
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
        <Col span={12}>
          <Select style={{width: "100%", textAlign: "left"}} value={props.platform} onChange={props.setPlatform}>
            <Select.Option value="douyu">{getPlatformReadableName("douyu")}</Select.Option>
            <Select.Option value="bilibili">{getPlatformReadableName("bilibili")}</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={6}>
          推流地址（rtmp）：
        </Col>
        <Col span={12}>
          <Input allowClear value={props.streamUrl} status={streamUrlInputStatus} onBlur={handleStreamUrlInputCheck}
                 onChange={e => props.setStreamUrl(e.target.value)} />
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={6}>
          推流码 / 直播密钥：
        </Col>
        <Col span={12}>
          <Input allowClear value={props.streamCode} onChange={e => props.setStreamCode(e.target.value)} />
        </Col>
      </Row>
      <Row className="info-row" align="middle">
        <Col className="tag-col" span={6}>
          开启录制：
        </Col>
        <Col span={12} style={{textAlign: "left"}}>
          <Switch value={props.recordingEnabled} onChange={checked => props.setRecordingEnabled(checked)} />
        </Col>
      </Row>
      {props.recordingEnabled && (
        <Row className="info-row" align="middle">
          <Col className="tag-col" span={6}>
            录制存储地址：
          </Col>
          <Col span={12}>
            <Input allowClear value={props.recordingPath} status={recordingPathInputStatus}
                   onBlur={handleRecordingPathInputCheck} onChange={e => props.setRecordingPath(e.target.value)} />
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

export default PlatformInfo;
