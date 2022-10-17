import { Button, Col, Input, message, Row } from "antd";
import React, { useState } from "react";

function TwitchInfo(props) {
  const [twitchIdInputStatus, setTwitchIdInputStatus] = useState(null);

  const handleTwitchIdInputCheck = () => {
    if (props.twitchId.trim() === "") {
      setTwitchIdInputStatus("error");
      return false;
    } else {
      setTwitchIdInputStatus(null);
      return true;
    }
  };

  const handleMoveNext = () => {
    let flag = handleTwitchIdInputCheck();
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
          Twitch 用户名：
        </Col>
        <Col span={12}>
          <Input allowClear value={props.twitchId} status={twitchIdInputStatus} onBlur={handleTwitchIdInputCheck}
                 onChange={e => props.setTwitchId(e.target.value)} />
        </Col>
      </Row>
      <Row align="middle">
        <Col offset={6} span={12}>
          <Button type="primary" onClick={handleMoveNext}>
            下一步
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default TwitchInfo;
