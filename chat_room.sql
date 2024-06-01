/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : chat_room

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 28/05/2024 22:16:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for friend_ship
-- ----------------------------
DROP TABLE IF EXISTS `friend_ship`;
CREATE TABLE `friend_ship`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NULL DEFAULT NULL COMMENT '自己id',
  `friendId` int(11) NULL DEFAULT NULL COMMENT '对方id',
  `sortedKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '自己id + 对方id',
  `state` enum('INITIATE','PASS','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'INITIATE' COMMENT '好友状态',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `userMsgNumber` int(11) NULL DEFAULT NULL COMMENT '自己发送给对方，对方未读信息数量',
  `friendMsgNumber` int(11) NULL DEFAULT NULL COMMENT '对方发给我，我这边未读信息数量',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_26df3e1d8b7428b9d601194839`(`userId` ASC, `friendId` ASC, `sortedKey` ASC) USING BTREE,
  INDEX `FK_7dfc010217195c6bc513a387b5d`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_23074ba2f6791bef3f5e9ee6c8e`(`toUserId` ASC) USING BTREE,
  CONSTRAINT `FK_23074ba2f6791bef3f5e9ee6c8e` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_7dfc010217195c6bc513a387b5d` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend_ship
-- ----------------------------
INSERT INTO `friend_ship` VALUES (3, 1, 2, '1-2', 'PASS', 1, 2, '阿斯顿', 0, 0, '2024-04-05 06:36:36.099917');
INSERT INTO `friend_ship` VALUES (4, 1, 3, '1-3', 'PASS', 1, 3, NULL, 2, 0, '2024-04-10 13:12:10.931333');

-- ----------------------------
-- Table structure for group_chat
-- ----------------------------
DROP TABLE IF EXISTS `group_chat`;
CREATE TABLE `group_chat`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '群名',
  `notice` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '公告',
  `createdUserId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_682430251530a14d93154def648`(`createdUserId` ASC) USING BTREE,
  CONSTRAINT `FK_682430251530a14d93154def648` FOREIGN KEY (`createdUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_chat
-- ----------------------------
INSERT INTO `group_chat` VALUES (6, '数斯常老力条,子需统论其族切', NULL, 1);
INSERT INTO `group_chat` VALUES (7, '数斯常老力条,子需统论其族切', NULL, 1);

-- ----------------------------
-- Table structure for group_chat_user
-- ----------------------------
DROP TABLE IF EXISTS `group_chat_user`;
CREATE TABLE `group_chat_user`  (
  `groupChatId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `isSpeak` tinyint(4) NULL DEFAULT 0 COMMENT '是否禁言',
  `msgNumber` int(11) NULL DEFAULT NULL COMMENT '消息数量',
  `enterTime` timestamp NULL DEFAULT NULL COMMENT '进入聊天室时间',
  `exitTime` timestamp NULL DEFAULT NULL COMMENT '离开聊天室时间',
  PRIMARY KEY (`groupChatId`, `userId`) USING BTREE,
  INDEX `IDX_6821d5492eb83f7e48d0fe124e`(`groupChatId` ASC) USING BTREE,
  INDEX `IDX_cd628a8651b7ff01b752a3638b`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_6821d5492eb83f7e48d0fe124e0` FOREIGN KEY (`groupChatId`) REFERENCES `group_chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cd628a8651b7ff01b752a3638b3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_chat_user
-- ----------------------------
INSERT INTO `group_chat_user` VALUES (6, 1, 0, NULL, '2024-05-26 21:45:34', '2024-05-26 21:45:47');
INSERT INTO `group_chat_user` VALUES (6, 2, 0, 1, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (6, 3, 0, 1, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (7, 1, 0, NULL, '2024-05-26 21:45:27', '2024-05-26 21:45:34');
INSERT INTO `group_chat_user` VALUES (7, 2, 0, 1, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (7, 3, 0, 1, NULL, NULL);

-- ----------------------------
-- Table structure for group_message
-- ----------------------------
DROP TABLE IF EXISTS `group_message`;
CREATE TABLE `group_message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `fileType` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件类型',
  `fileSize` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件大小',
  `postMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '聊天内容',
  `groupId` int(11) NULL DEFAULT NULL COMMENT '群id/同时是接收者id',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_58500392580a2312a7c8faf313a`(`groupId` ASC) USING BTREE,
  INDEX `FK_a028d293a2fad8637ad79196566`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_58500392580a2312a7c8faf313a` FOREIGN KEY (`groupId`) REFERENCES `group_chat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_a028d293a2fad8637ad79196566` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_message
-- ----------------------------
INSERT INTO `group_message` VALUES (16, 'UNREAD', NULL, NULL, 'asdsadasd', 6, 1, '2024-05-10 05:43:58.878374');
INSERT INTO `group_message` VALUES (17, 'UNREAD', NULL, NULL, '啊实打实打算', 7, 1, '2024-05-10 06:43:39.491885');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileType` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件类型',
  `fileSize` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件大小',
  `postMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '聊天内容',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_c59262513a3006fd8f58bb4b7c2`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_96789153e31e0bb7885ea13a279`(`toUserId` ASC) USING BTREE,
  CONSTRAINT `FK_96789153e31e0bb7885ea13a279` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c59262513a3006fd8f58bb4b7c2` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 121 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (112, NULL, NULL, 'fhg', 'UNREAD', '2024-05-09 02:07:16.110033', 1, 3);
INSERT INTO `message` VALUES (113, NULL, NULL, '45', 'READ', '2024-05-09 02:56:02.950074', 1, 2);
INSERT INTO `message` VALUES (114, NULL, NULL, 'dfdsfg', 'READ', '2024-05-09 02:57:45.326710', 2, 1);
INSERT INTO `message` VALUES (115, NULL, NULL, 'sdf', 'READ', '2024-05-09 03:00:42.225220', 2, 1);
INSERT INTO `message` VALUES (116, NULL, NULL, 'sdfdfgdfg', 'READ', '2024-05-09 03:00:54.171260', 2, 1);
INSERT INTO `message` VALUES (117, NULL, NULL, 'sdfdfgdfgasdas', 'READ', '2024-05-09 03:01:15.696465', 2, 1);
INSERT INTO `message` VALUES (118, NULL, NULL, 'dfg', 'READ', '2024-05-09 03:02:38.149121', 2, 1);
INSERT INTO `message` VALUES (119, NULL, NULL, '1', 'READ', '2024-05-09 03:03:21.728149', 2, 1);
INSERT INTO `message` VALUES (120, NULL, NULL, 'fd', 'UNREAD', '2024-05-09 03:03:36.887525', 1, 2);

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `friendMsgNumber` int(11) NULL DEFAULT NULL COMMENT '对方发给我，我这边未读信息数量',
  `userMsgNumber` int(11) NULL DEFAULT NULL COMMENT '自己发送给对方，对方未读信息数量',
  `msgType` enum('ONE_FOR_ONE','MANY_TO_MANY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ONE_FOR_ONE' COMMENT '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `newMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '最新的信息',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  `groupId` int(11) NULL DEFAULT NULL COMMENT '群id/同时是接收者id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_74b0f15aa3a83f8ef25f053ff0`(`toUserId` ASC, `fromUserId` ASC) USING BTREE,
  INDEX `FK_e3b1ce8ea3457922ac3d9266ba3`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_be9e12d1b6007810eacb135a964`(`groupId` ASC) USING BTREE,
  CONSTRAINT `FK_392760210d977325dc85150ceab` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_be9e12d1b6007810eacb135a964` FOREIGN KEY (`groupId`) REFERENCES `group_chat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e3b1ce8ea3457922ac3d9266ba3` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (25, NULL, NULL, 'ONE_FOR_ONE', '2024-05-09 03:03:36.000000', 'UNREAD', 'fd', 1, 2, NULL);
INSERT INTO `notice` VALUES (26, NULL, NULL, 'ONE_FOR_ONE', '2024-05-09 03:00:49.516206', 'UNREAD', '', 1, 3, NULL);
INSERT INTO `notice` VALUES (27, NULL, NULL, 'MANY_TO_MANY', '2024-05-10 05:43:58.000000', 'UNREAD', 'asdsadasd', 1, NULL, 6);
INSERT INTO `notice` VALUES (28, NULL, NULL, 'MANY_TO_MANY', '2024-05-10 06:43:39.000000', 'UNREAD', '啊实打实打算', 1, NULL, 7);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `headerImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码',
  `gender` int(11) NOT NULL COMMENT '性别',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_065d4d8f3b5adb4a08841eae3c`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '产克太市花月', '孔秀兰', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (2, '数斯常老力条', '丁平', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1);
INSERT INTO `user` VALUES (3, '子需统论其族切', '贾敏', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1);
INSERT INTO `user` VALUES (4, '不土般需候八', '李强', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (5, '还京严我飞油', '杨娟', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 2);
INSERT INTO `user` VALUES (6, '候说位解前温去', '侯磊', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (7, '况品会再', '何丽', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (8, '员速增地速的', '袁艳', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1);
INSERT INTO `user` VALUES (9, '分已照说', '苏磊', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (10, '较行你级', '姚秀兰', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 2);
INSERT INTO `user` VALUES (11, '长几青直', '胡敏', 'http://dummyimage.com/400x400', '12531fe7eb88a448b9e457eaf6cc2bc6', 1);
INSERT INTO `user` VALUES (12, '明严属对', '陆强', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (13, '断今或用南整', '龙磊', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1);
INSERT INTO `user` VALUES (14, '严该口低厂组', '张超', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);
INSERT INTO `user` VALUES (15, '现得交联农', '林丽', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1);
INSERT INTO `user` VALUES (16, '自龙完子调人', '任勇', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0);

SET FOREIGN_KEY_CHECKS = 1;
