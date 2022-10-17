export function getPlatformReadableName(platform) {
    switch (platform) {
      case "douyu":
        return "斗鱼";
      case "bilibili":
        return "哔哩哔哩";
      default:
        return "未知平台";
    }
  }