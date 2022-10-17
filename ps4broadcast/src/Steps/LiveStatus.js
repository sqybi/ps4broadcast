import { Progress } from "antd";
import React, { useCallback } from "react";

function LiveStatus(props) {
  const currentProgressPercent = useCallback(() => {
    switch (props.liveStatus) {
      case "stopped":
        return 0;
      case "connectedPlayStation":
        return 30;
      case "connectedTwitch":
        return 70;
      case "started":
        return 100;
      default:
        return 0;
    }
  }, [props])

  const currentProgressStatus = useCallback(() => {
    switch (props.liveStatus) {
      case "stopped":
        return "normal";
      case "connectedPlayStation":
      case "connectedTwitch":
        return "active";
      case "started":
        return "success";
      default:
        return "exception";
    }
  }, [props])

  return (
    <>
      <Progress percent={currentProgressPercent()} status={currentProgressStatus()} />
    </>
  );
}

export default LiveStatus;
