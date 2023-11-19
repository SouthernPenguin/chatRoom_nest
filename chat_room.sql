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

 Date: 19/11/2023 14:20:02
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
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_26df3e1d8b7428b9d601194839`(`userId` ASC, `friendId` ASC, `sortedKey` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend_ship
-- ----------------------------
INSERT INTO `friend_ship` VALUES (18, 1, 8, '1-8', 'PASS', '2023-11-08 01:29:34.795925');
INSERT INTO `friend_ship` VALUES (19, 1, 7, '1-7', 'PASS', '2023-11-08 01:29:34.795925');
INSERT INTO `friend_ship` VALUES (20, 6, 1, '6-1', 'PASS', '2023-11-18 05:24:43.582640');
INSERT INTO `friend_ship` VALUES (23, 11, 1, '11-1', 'PASS', '2023-11-18 07:35:13.555846');

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
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_96789153e31e0bb7885ea13a279`(`toUserId` ASC) USING BTREE,
  INDEX `FK_c59262513a3006fd8f58bb4b7c2`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_96789153e31e0bb7885ea13a279` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c59262513a3006fd8f58bb4b7c2` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 145 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('现在是test1向《子则就人南》发送消息第一条消息', 'UNREAD', 1, 11, 136, NULL, '2023-11-19 05:19:31.632883');
INSERT INTO `message` VALUES ('现在是子则就人南向《test1》发送消息第一条消息', 'UNREAD', 11, 1, 137, NULL, '2023-11-19 05:21:28.444549');
INSERT INTO `message` VALUES ('现在是子则就人南向《test1》发送消息第2条消息', 'UNREAD', 11, 1, 138, NULL, '2023-11-19 05:29:05.908588');
INSERT INTO `message` VALUES ('现在是test1向《子则就人南》发送消息第2条消息', 'UNREAD', 1, 11, 139, NULL, '2023-11-19 05:30:07.959938');
INSERT INTO `message` VALUES ('现在是子则就人南向《test1》发送消息第3条消息', 'UNREAD', 11, 1, 142, NULL, '2023-11-19 05:43:37.916327');
INSERT INTO `message` VALUES ('现在是子则就人南向《test1》发送消息第3条消息', 'UNREAD', 1, 11, 144, NULL, '2023-11-19 06:16:04.242221');

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `newMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci NOT NULL COMMENT '最新的信息',
  `fromUserId` int(11) NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int(11) NULL DEFAULT NULL COMMENT '接收者(ID)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_74b0f15aa3a83f8ef25f053ff0`(`toUserId` ASC, `fromUserId` ASC) USING BTREE,
  INDEX `FK_e3b1ce8ea3457922ac3d9266ba3`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_392760210d977325dc85150ceab` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e3b1ce8ea3457922ac3d9266ba3` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (24, '2023-11-19 06:16:04.000000', 'UNREAD', '现在是子则就人南向《test1》发送消息第3条消息', 1, 11);

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
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 1, 'test1', '675a3867bd36ed867d480551c1000dc4', 'test1', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (6, 0, 'test2', '675a3867bd36ed867d480551c1000dc4', 'test2', '');
INSERT INTO `user` VALUES (7, 0, 'test3', '675a3867bd36ed867d480551c1000dc4', 'test3', '');
INSERT INTO `user` VALUES (8, 0, 'test4', '675a3867bd36ed867d480551c1000dc4', 'test4', '');
INSERT INTO `user` VALUES (11, 1, '子则就人南', '675a3867bd36ed867d480551c1000dc4', '子则就人南', '');
INSERT INTO `user` VALUES (12, 1, '联回门系该', '675a3867bd36ed867d480551c1000dc4', '联回门系该', '');
INSERT INTO `user` VALUES (13, 0, '较回见', '675a3867bd36ed867d480551c1000dc4', '较回见', '');
INSERT INTO `user` VALUES (14, 1, '潘艳', '675a3867bd36ed867d480551c1000dc4', '潘艳', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (15, 0, '深且如说须', '675a3867bd36ed867d480551c1000dc4', '张超', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (16, 1, '看相族', '675a3867bd36ed867d480551c1000dc4', '毛涛', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (17, 1, '里县美一业第', '675a3867bd36ed867d480551c1000dc4', '宋平', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (18, 1, '听水区比要', '675a3867bd36ed867d480551c1000dc4', '龚秀英', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (19, 0, '等色术越', '675a3867bd36ed867d480551c1000dc4', '胡强', 'http://dummyimage.com/400x400');
INSERT INTO `user` VALUES (20, 1, '后体么价', '675a3867bd36ed867d480551c1000dc4', '雷勇', 'http://dummyimage.com/400x400');

SET FOREIGN_KEY_CHECKS = 1;
