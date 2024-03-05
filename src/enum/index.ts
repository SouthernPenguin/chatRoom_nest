// 添加好友状态
export enum FriendShipEnum {
  发起 = 'INITIATE', // 发起
  通过 = 'PASS', // 通过
  删除 = 'DELETE',
  // 拒绝 = 'REFUSE', // 拒绝
}

// 聊天记录状态
export enum MessageEnum {
  未读 = 'UNREAD',
  已读 = 'READ',
  撤回 = 'WITHDRAW',
  删除 = 'DELETE',
}

// 上传文件
export enum UpLoadEnum {
  用户头像 = 'IMAGE_HEARD',
  聊天信息 = 'MESSAGE_FILE',
}

// 文件来源
export enum FilesSource {
  私聊 = 'ONE_FOR_ONE',
  群聊 = 'MANY_TO_MANY',
}

// 聊天类型
export enum ChatType {
  私聊 = 'ONE_FOR_ONE',
  群聊 = 'MANY_TO_MANY',
}
