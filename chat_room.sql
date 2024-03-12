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

 Date: 12/03/2024 09:37:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '文件名',
  `size` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '文件大小',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '文件类型',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '文件路径',
  `upLoadUserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '上传者id',
  `createdTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file
-- ----------------------------

-- ----------------------------
-- Table structure for friend_ship
-- ----------------------------
DROP TABLE IF EXISTS `friend_ship`;
CREATE TABLE `friend_ship`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NULL DEFAULT NULL COMMENT '自己id',
  `friendId` int(11) NULL DEFAULT NULL COMMENT '对方id',
  `sortedKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '自己id + 对方id',
  `state` enum('INITIATE','PASS','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL DEFAULT 'INITIATE' COMMENT '好友状态',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '备注',
  `messageNumber` int(11) NULL DEFAULT NULL COMMENT '消息数量',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_26df3e1d8b7428b9d601194839`(`userId` ASC, `friendId` ASC, `sortedKey` ASC) USING BTREE,
  INDEX `FK_7dfc010217195c6bc513a387b5d`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_23074ba2f6791bef3f5e9ee6c8e`(`toUserId` ASC) USING BTREE,
  CONSTRAINT `FK_23074ba2f6791bef3f5e9ee6c8e` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_7dfc010217195c6bc513a387b5d` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend_ship
-- ----------------------------
INSERT INTO `friend_ship` VALUES (35, 6, 1, '6-1', 'PASS', '2023-12-17 07:37:39.992965', 6, 1, 'minim culpa', NULL);
INSERT INTO `friend_ship` VALUES (47, 1, 8, '1-8', 'PASS', '2023-12-23 08:08:40.628162', 1, 8, 'sdsad', NULL);
INSERT INTO `friend_ship` VALUES (48, 1, 7, '1-7', 'PASS', '2023-12-24 13:17:53.655104', 1, 7, '333', NULL);
INSERT INTO `friend_ship` VALUES (49, 8, 7, '8-7', 'PASS', '2024-02-27 12:51:42.990254', 8, 7, 'ts', NULL);

-- ----------------------------
-- Table structure for group_chat
-- ----------------------------
DROP TABLE IF EXISTS `group_chat`;
CREATE TABLE `group_chat`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '群名',
  `notice` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '公告',
  `createdUserId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_682430251530a14d93154def648`(`createdUserId` ASC) USING BTREE,
  CONSTRAINT `FK_682430251530a14d93154def648` FOREIGN KEY (`createdUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_chat
-- ----------------------------
INSERT INTO `group_chat` VALUES (3, '资新车1', NULL, 1);
INSERT INTO `group_chat` VALUES (4, '资新车2', NULL, 6);
INSERT INTO `group_chat` VALUES (5, '资新车3', 'magna officia aute sint voluptate', 7);
INSERT INTO `group_chat` VALUES (7, '资新车4', NULL, 7);
INSERT INTO `group_chat` VALUES (10, '话养府型精利', NULL, 19);

-- ----------------------------
-- Table structure for group_chat_user
-- ----------------------------
DROP TABLE IF EXISTS `group_chat_user`;
CREATE TABLE `group_chat_user`  (
  `groupChatId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `isSpeak` tinyint(4) NULL DEFAULT 0 COMMENT '是否禁言',
  `messageNumber` int(11) NULL DEFAULT NULL COMMENT '消息数量',
  PRIMARY KEY (`groupChatId`, `userId`) USING BTREE,
  INDEX `IDX_6821d5492eb83f7e48d0fe124e`(`groupChatId` ASC) USING BTREE,
  INDEX `IDX_cd628a8651b7ff01b752a3638b`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_6821d5492eb83f7e48d0fe124e0` FOREIGN KEY (`groupChatId`) REFERENCES `group_chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cd628a8651b7ff01b752a3638b3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_chat_user
-- ----------------------------
INSERT INTO `group_chat_user` VALUES (3, 6, 0, NULL);
INSERT INTO `group_chat_user` VALUES (3, 7, 0, NULL);
INSERT INTO `group_chat_user` VALUES (3, 8, 0, NULL);
INSERT INTO `group_chat_user` VALUES (4, 1, 0, NULL);
INSERT INTO `group_chat_user` VALUES (4, 6, 0, NULL);
INSERT INTO `group_chat_user` VALUES (4, 7, 0, NULL);
INSERT INTO `group_chat_user` VALUES (4, 8, 0, NULL);
INSERT INTO `group_chat_user` VALUES (5, 7, 0, NULL);
INSERT INTO `group_chat_user` VALUES (5, 22, 0, NULL);
INSERT INTO `group_chat_user` VALUES (7, 7, 0, NULL);
INSERT INTO `group_chat_user` VALUES (7, 21, 0, NULL);
INSERT INTO `group_chat_user` VALUES (7, 22, 0, NULL);
INSERT INTO `group_chat_user` VALUES (10, 20, 0, NULL);

-- ----------------------------
-- Table structure for group_message
-- ----------------------------
DROP TABLE IF EXISTS `group_message`;
CREATE TABLE `group_message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileType` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '文件类型',
  `fileSize` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '文件大小',
  `postMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '聊天内容',
  `groupId` int(11) NULL DEFAULT NULL COMMENT '群id/同时是接收者id',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_58500392580a2312a7c8faf313a`(`groupId` ASC) USING BTREE,
  INDEX `FK_a028d293a2fad8637ad79196566`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_58500392580a2312a7c8faf313a` FOREIGN KEY (`groupId`) REFERENCES `group_chat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_a028d293a2fad8637ad79196566` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_message
-- ----------------------------
INSERT INTO `group_message` VALUES (36, NULL, NULL, 'wert', 3, 7, '2024-03-05 06:51:38.732174', 'UNREAD');
INSERT INTO `group_message` VALUES (37, 'txt', '1.02 KB', 'http://127.0.0.1:8468//files/工厂名.txt', 3, 7, '2024-03-05 06:51:49.025916', 'UNREAD');
INSERT INTO `group_message` VALUES (38, 'txt', '1.02 KB', 'http://127.0.0.1:8468//files/工厂名.txt', 7, 7, '2024-03-05 06:52:04.738501', 'UNREAD');
INSERT INTO `group_message` VALUES (39, NULL, NULL, '撤销测试', 3, 7, '2024-03-05 07:13:20.390266', 'WITHDRAW');
INSERT INTO `group_message` VALUES (40, NULL, NULL, '删除测试', 3, 7, '2024-03-05 07:13:33.312177', 'DELETE');
INSERT INTO `group_message` VALUES (41, NULL, NULL, '我是test3', 3, 7, '2024-03-05 11:52:49.950821', 'UNREAD');
INSERT INTO `group_message` VALUES (42, NULL, NULL, '我是test2', 3, 1, '2024-03-05 11:53:16.024612', 'WITHDRAW');
INSERT INTO `group_message` VALUES (43, NULL, NULL, '我是test1', 3, 1, '2024-03-05 11:53:37.744006', 'UNREAD');
INSERT INTO `group_message` VALUES (44, NULL, NULL, '我是test2', 3, 8, '2024-03-05 11:53:49.968954', 'WITHDRAW');
INSERT INTO `group_message` VALUES (45, NULL, NULL, '我是test4', 3, 8, '2024-03-05 11:54:02.999732', 'UNREAD');
INSERT INTO `group_message` VALUES (46, NULL, NULL, '阿斯顿', 3, 8, '2024-03-05 12:05:00.437403', 'WITHDRAW');
INSERT INTO `group_message` VALUES (47, NULL, NULL, '烦烦烦', 3, 8, '2024-03-05 12:23:19.040732', 'WITHDRAW');
INSERT INTO `group_message` VALUES (48, NULL, NULL, '士大夫', 3, 8, '2024-03-05 12:24:03.819154', 'WITHDRAW');
INSERT INTO `group_message` VALUES (49, NULL, NULL, '微单', 3, 8, '2024-03-05 12:24:51.865158', 'WITHDRAW');
INSERT INTO `group_message` VALUES (50, NULL, NULL, '士大夫v', 3, 8, '2024-03-05 12:26:15.145888', 'WITHDRAW');
INSERT INTO `group_message` VALUES (51, NULL, NULL, '2', 3, 7, '2024-03-05 12:29:03.895111', 'WITHDRAW');
INSERT INTO `group_message` VALUES (52, NULL, NULL, '软弱', 3, 7, '2024-03-05 12:32:12.789037', 'WITHDRAW');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `postMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '聊天内容',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileType` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '文件类型',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fileSize` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '文件大小',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_96789153e31e0bb7885ea13a279`(`toUserId` ASC) USING BTREE,
  INDEX `FK_c59262513a3006fd8f58bb4b7c2`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_96789153e31e0bb7885ea13a279` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c59262513a3006fd8f58bb4b7c2` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 217 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('232', 'UNREAD', 7, 1, 209, NULL, '2024-03-05 07:16:29.029503', NULL);
INSERT INTO `message` VALUES ('erf', 'UNREAD', 1, 7, 210, NULL, '2024-03-05 07:16:58.052765', NULL);
INSERT INTO `message` VALUES ('sdfbv', 'UNREAD', 1, 7, 211, NULL, '2024-03-05 11:51:12.737993', NULL);
INSERT INTO `message` VALUES ('sdvfc', 'UNREAD', 7, 1, 212, NULL, '2024-03-05 11:51:17.136331', NULL);
INSERT INTO `message` VALUES ('撒地方', 'UNREAD', 8, 7, 213, NULL, '2024-03-05 11:56:28.847962', NULL);
INSERT INTO `message` VALUES ('是否', 'WITHDRAW', 7, 8, 214, NULL, '2024-03-05 11:59:51.802446', NULL);
INSERT INTO `message` VALUES ('是否', 'UNREAD', 7, 8, 215, NULL, '2024-03-05 12:04:10.668539', NULL);
INSERT INTO `message` VALUES ('a发顺丰', 'WITHDRAW', 8, 7, 216, NULL, '2024-03-05 12:04:29.062318', NULL);

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `newMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL COMMENT '最新的信息',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  `msgType` enum('ONE_FOR_ONE','MANY_TO_MANY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL DEFAULT 'ONE_FOR_ONE' COMMENT '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
  `groupId` int(11) NULL DEFAULT NULL COMMENT '群id/同时是接收者id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_74b0f15aa3a83f8ef25f053ff0`(`toUserId` ASC, `fromUserId` ASC) USING BTREE,
  INDEX `FK_e3b1ce8ea3457922ac3d9266ba3`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_be9e12d1b6007810eacb135a964`(`groupId` ASC) USING BTREE,
  CONSTRAINT `FK_392760210d977325dc85150ceab` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_be9e12d1b6007810eacb135a964` FOREIGN KEY (`groupId`) REFERENCES `group_chat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e3b1ce8ea3457922ac3d9266ba3` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 78 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (74, '2024-03-05 12:32:12.000000', 'UNREAD', '软弱', 7, NULL, 'MANY_TO_MANY', 3);
INSERT INTO `notice` VALUES (75, '2024-03-05 06:52:04.000000', 'UNREAD', '工厂名.txt', 7, NULL, 'MANY_TO_MANY', 7);
INSERT INTO `notice` VALUES (76, '2024-03-05 11:51:17.000000', 'UNREAD', 'sdvfc', 7, 1, 'ONE_FOR_ONE', NULL);
INSERT INTO `notice` VALUES (77, '2024-03-05 12:04:29.000000', 'UNREAD', 'a发顺丰', 8, 7, 'ONE_FOR_ONE', NULL);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gender` int(11) NOT NULL COMMENT '性别',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NULL DEFAULT NULL COMMENT '密码',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL COMMENT '昵称',
  `headerImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL COMMENT '头像',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_065d4d8f3b5adb4a08841eae3c`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 1, 'test1', '675a3867bd36ed867d480551c1000dc4', 'test1', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (6, 0, 'test2', '675a3867bd36ed867d480551c1000dc4', 'test2', '');
INSERT INTO `user` VALUES (7, 0, 'test3', '675a3867bd36ed867d480551c1000dc4', 'test3', '');
INSERT INTO `user` VALUES (8, 0, 'test4', '675a3867bd36ed867d480551c1000dc4', 'test4', '');
INSERT INTO `user` VALUES (11, 1, '子则就人南', '675a3867bd36ed867d480551c1000dc4', '子则就人南', 'https://tupian.qqw21.com/article/UploadPic/2021-4/20214720294413745.jpg');
INSERT INTO `user` VALUES (12, 1, '联回门系该', '675a3867bd36ed867d480551c1000dc4', '联回门系该', '');
INSERT INTO `user` VALUES (13, 0, '较回见', '675a3867bd36ed867d480551c1000dc4', '较回见', '');
INSERT INTO `user` VALUES (14, 1, '潘艳', '675a3867bd36ed867d480551c1000dc4', '潘艳', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (15, 0, '深且如说须', '675a3867bd36ed867d480551c1000dc4', '张超', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (16, 1, '看相族', '675a3867bd36ed867d480551c1000dc4', '毛涛', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (17, 1, '里县美一业第', '675a3867bd36ed867d480551c1000dc4', '宋平', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (18, 1, '听水区比要', '675a3867bd36ed867d480551c1000dc4', '龚秀英', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (19, 0, '等色术越', '675a3867bd36ed867d480551c1000dc4', '胡强', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (20, 1, '后体么价', '675a3867bd36ed867d480551c1000dc4', '雷勇', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (21, 0, '对该件', '675a3867bd36ed867d480551c1000dc4', '毛霞', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (22, 1, '团么属工圆然其', '675a3867bd36ed867d480551c1000dc4', '曾涛', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (23, 1, '里行部选', '675a3867bd36ed867d480551c1000dc4', '宋艳', 'http://dummyimage.com/400x400');

SET FOREIGN_KEY_CHECKS = 1;
