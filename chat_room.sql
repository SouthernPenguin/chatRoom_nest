/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80400 (8.4.0)
 Source Host           : 127.0.0.1:3306
 Source Schema         : chat_room

 Target Server Type    : MySQL
 Target Server Version : 80400 (8.4.0)
 File Encoding         : 65001

 Date: 10/09/2024 10:04:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for friend_ship
-- ----------------------------
DROP TABLE IF EXISTS `friend_ship`;
CREATE TABLE `friend_ship`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NULL DEFAULT NULL COMMENT '自己id',
  `friendId` int NULL DEFAULT NULL COMMENT '对方id',
  `sortedKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '自己id + 对方id',
  `state` enum('INITIATE','PASS','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'INITIATE' COMMENT '好友状态',
  `fromUserId` int NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int NULL DEFAULT NULL COMMENT '接收者(ID)',
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `userMsgNumber` int NULL DEFAULT NULL COMMENT '自己发送给对方，对方未读信息数量',
  `friendMsgNumber` int NULL DEFAULT NULL COMMENT '对方发给我，我这边未读信息数量',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_26df3e1d8b7428b9d601194839`(`userId` ASC, `friendId` ASC, `sortedKey` ASC) USING BTREE,
  INDEX `FK_7dfc010217195c6bc513a387b5d`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_23074ba2f6791bef3f5e9ee6c8e`(`toUserId` ASC) USING BTREE,
  CONSTRAINT `FK_23074ba2f6791bef3f5e9ee6c8e` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_7dfc010217195c6bc513a387b5d` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '群名',
  `notice` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '公告',
  `createdUserId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_682430251530a14d93154def648`(`createdUserId` ASC) USING BTREE,
  CONSTRAINT `FK_682430251530a14d93154def648` FOREIGN KEY (`createdUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_chat
-- ----------------------------
INSERT INTO `group_chat` VALUES (8, '数斯常老力条,子需统论其族切', NULL, 1);
INSERT INTO `group_chat` VALUES (9, '数斯常老力条,子需统论其族切', NULL, 1);

-- ----------------------------
-- Table structure for group_chat_user
-- ----------------------------
DROP TABLE IF EXISTS `group_chat_user`;
CREATE TABLE `group_chat_user`  (
  `groupChatId` int NOT NULL,
  `userId` int NOT NULL,
  `isSpeak` tinyint NULL DEFAULT 0 COMMENT '是否禁言',
  `msgNumber` int NULL DEFAULT NULL COMMENT '消息数量',
  `enterTime` timestamp NULL DEFAULT NULL COMMENT '进入聊天室时间',
  `exitTime` timestamp NULL DEFAULT NULL COMMENT '离开聊天室时间',
  PRIMARY KEY (`groupChatId`, `userId`) USING BTREE,
  INDEX `IDX_6821d5492eb83f7e48d0fe124e`(`groupChatId` ASC) USING BTREE,
  INDEX `IDX_cd628a8651b7ff01b752a3638b`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_6821d5492eb83f7e48d0fe124e0` FOREIGN KEY (`groupChatId`) REFERENCES `group_chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cd628a8651b7ff01b752a3638b3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_chat_user
-- ----------------------------
INSERT INTO `group_chat_user` VALUES (8, 1, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (8, 2, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (8, 3, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (9, 1, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (9, 2, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (9, 3, 0, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for group_message
-- ----------------------------
DROP TABLE IF EXISTS `group_message`;
CREATE TABLE `group_message`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `fileType` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件类型',
  `fileSize` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件大小',
  `postMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '聊天内容',
  `groupId` int NULL DEFAULT NULL COMMENT '群id/同时是接收者id',
  `fromUserId` int NULL DEFAULT NULL COMMENT '发送者(ID)',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_58500392580a2312a7c8faf313a`(`groupId` ASC) USING BTREE,
  INDEX `FK_a028d293a2fad8637ad79196566`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_58500392580a2312a7c8faf313a` FOREIGN KEY (`groupId`) REFERENCES `group_chat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_a028d293a2fad8637ad79196566` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_message
-- ----------------------------
INSERT INTO `group_message` VALUES (20, 'UNREAD', NULL, NULL, '444', 8, 1, '2024-05-31 20:48:20.769569');
INSERT INTO `group_message` VALUES (21, 'UNREAD', NULL, NULL, '444', 8, 1, '2024-05-31 20:58:22.552563');
INSERT INTO `group_message` VALUES (22, 'UNREAD', NULL, NULL, '=\n', 8, 1, '2024-05-31 22:06:28.726721');
INSERT INTO `group_message` VALUES (23, 'UNREAD', NULL, NULL, '4', 8, 1, '2024-05-31 22:09:06.137075');
INSERT INTO `group_message` VALUES (24, 'UNREAD', NULL, NULL, '2', 8, 1, '2024-05-31 22:09:54.299258');
INSERT INTO `group_message` VALUES (25, 'UNREAD', NULL, NULL, '2ss', 8, 1, '2024-05-31 22:09:59.752859');
INSERT INTO `group_message` VALUES (26, 'UNREAD', NULL, NULL, '123', 8, 2, '2024-06-01 14:09:27.674731');
INSERT INTO `group_message` VALUES (27, 'UNREAD', NULL, NULL, '4', 8, 2, '2024-06-01 14:10:32.567946');
INSERT INTO `group_message` VALUES (28, 'UNREAD', NULL, NULL, '444', 8, 2, '2024-06-01 14:11:41.074132');
INSERT INTO `group_message` VALUES (29, 'UNREAD', NULL, NULL, 'ooo', 8, 2, '2024-06-01 14:12:35.583086');
INSERT INTO `group_message` VALUES (30, 'UNREAD', NULL, NULL, '56', 8, 2, '2024-06-01 14:13:24.518803');
INSERT INTO `group_message` VALUES (31, 'UNREAD', NULL, NULL, 'ttt', 8, 2, '2024-06-01 14:13:35.019312');
INSERT INTO `group_message` VALUES (32, 'UNREAD', NULL, NULL, '6', 8, 2, '2024-06-01 14:19:12.988879');
INSERT INTO `group_message` VALUES (33, 'UNREAD', NULL, NULL, '623', 8, 2, '2024-06-01 14:20:15.528736');
INSERT INTO `group_message` VALUES (34, 'UNREAD', NULL, NULL, 'as', 8, 2, '2024-06-01 14:20:57.031743');
INSERT INTO `group_message` VALUES (35, 'UNREAD', NULL, NULL, '【】】', 8, 1, '2024-06-01 14:39:41.929404');
INSERT INTO `group_message` VALUES (36, 'UNREAD', NULL, NULL, '67', 8, 2, '2024-06-01 15:18:18.912922');
INSERT INTO `group_message` VALUES (37, 'UNREAD', NULL, NULL, '666', 8, 2, '2024-06-01 15:18:42.891686');
INSERT INTO `group_message` VALUES (38, 'UNREAD', NULL, NULL, '444', 8, 2, '2024-06-01 15:19:49.811302');
INSERT INTO `group_message` VALUES (39, 'UNREAD', NULL, NULL, '33', 8, 2, '2024-06-01 15:20:58.561495');
INSERT INTO `group_message` VALUES (40, 'UNREAD', NULL, NULL, '66', 8, 2, '2024-06-01 15:38:46.710771');
INSERT INTO `group_message` VALUES (41, 'UNREAD', NULL, NULL, '6', 8, 2, '2024-06-01 15:40:26.504800');
INSERT INTO `group_message` VALUES (42, 'UNREAD', NULL, NULL, '66', 8, 2, '2024-06-01 15:42:06.458381');
INSERT INTO `group_message` VALUES (43, 'UNREAD', NULL, NULL, '67867', 8, 2, '2024-06-01 15:42:50.644465');
INSERT INTO `group_message` VALUES (44, 'UNREAD', NULL, NULL, '556', 8, 2, '2024-06-01 15:46:22.691616');
INSERT INTO `group_message` VALUES (45, 'UNREAD', NULL, NULL, '6', 8, 2, '2024-06-01 15:47:12.919808');
INSERT INTO `group_message` VALUES (46, 'UNREAD', NULL, NULL, '678', 8, 2, '2024-06-01 15:47:43.094777');
INSERT INTO `group_message` VALUES (47, 'UNREAD', NULL, NULL, '56', 8, 2, '2024-06-01 16:09:48.873055');
INSERT INTO `group_message` VALUES (48, 'UNREAD', NULL, NULL, '56567', 8, 2, '2024-06-01 16:10:15.113912');
INSERT INTO `group_message` VALUES (49, 'UNREAD', NULL, NULL, '5656766', 8, 2, '2024-06-01 16:10:57.494206');
INSERT INTO `group_message` VALUES (50, 'UNREAD', NULL, NULL, '5656766asd', 8, 2, '2024-06-01 16:11:38.636108');
INSERT INTO `group_message` VALUES (51, 'UNREAD', NULL, NULL, '5656766asd555', 8, 2, '2024-06-01 16:16:42.315778');
INSERT INTO `group_message` VALUES (52, 'UNREAD', NULL, NULL, '666', 8, 2, '2024-06-01 16:19:24.758308');
INSERT INTO `group_message` VALUES (53, 'UNREAD', NULL, NULL, '55', 8, 2, '2024-06-01 16:20:29.341309');
INSERT INTO `group_message` VALUES (54, 'UNREAD', NULL, NULL, '678', 8, 2, '2024-06-01 16:23:23.474361');
INSERT INTO `group_message` VALUES (55, 'UNREAD', NULL, NULL, '567', 8, 2, '2024-06-01 16:33:47.961549');
INSERT INTO `group_message` VALUES (56, 'UNREAD', NULL, NULL, '23', 8, 2, '2024-06-01 16:34:45.628271');
INSERT INTO `group_message` VALUES (57, 'UNREAD', NULL, NULL, '5', 8, 2, '2024-06-01 16:35:23.636700');
INSERT INTO `group_message` VALUES (58, 'UNREAD', NULL, NULL, 'oooo', 8, 2, '2024-06-01 16:36:23.861683');
INSERT INTO `group_message` VALUES (59, 'UNREAD', NULL, NULL, '5', 8, 2, '2024-06-01 16:37:15.977172');
INSERT INTO `group_message` VALUES (60, 'UNREAD', NULL, NULL, '555', 8, 2, '2024-06-01 16:40:01.793133');
INSERT INTO `group_message` VALUES (61, 'UNREAD', NULL, NULL, '666', 8, 2, '2024-06-01 16:41:11.474051');
INSERT INTO `group_message` VALUES (62, 'UNREAD', NULL, NULL, '66', 8, 2, '2024-06-01 16:42:35.023315');
INSERT INTO `group_message` VALUES (63, 'UNREAD', NULL, NULL, '6', 8, 2, '2024-06-01 16:43:30.467491');
INSERT INTO `group_message` VALUES (64, 'UNREAD', NULL, NULL, '6666', 8, 2, '2024-06-01 16:43:59.254607');
INSERT INTO `group_message` VALUES (65, 'UNREAD', 'png', '119.57 KB', 'http://127.0.0.1:8768//files/QQ截图20221015221514.png', 8, 1, '2024-07-01 15:34:59.644438');
INSERT INTO `group_message` VALUES (66, 'UNREAD', NULL, NULL, 'dfasdasd', 8, 1, '2024-07-22 15:20:38.395917');
INSERT INTO `group_message` VALUES (67, 'UNREAD', NULL, NULL, '324234edf', 9, 1, '2024-07-22 15:20:45.840135');
INSERT INTO `group_message` VALUES (68, 'UNREAD', NULL, NULL, 'sdsads', 9, 1, '2024-07-22 16:13:16.515506');
INSERT INTO `group_message` VALUES (69, 'UNREAD', NULL, NULL, '987', 9, 1, '2024-07-22 16:13:33.602684');
INSERT INTO `group_message` VALUES (70, 'UNREAD', NULL, NULL, '234234', 8, 1, '2024-07-22 16:14:37.714873');
INSERT INTO `group_message` VALUES (71, 'UNREAD', NULL, NULL, 'fd', 8, 1, '2024-07-22 16:17:10.762152');
INSERT INTO `group_message` VALUES (72, 'UNREAD', NULL, NULL, 'dfx', 8, 1, '2024-07-22 16:20:30.513528');
INSERT INTO `group_message` VALUES (73, 'UNREAD', NULL, NULL, 'dfx123', 9, 1, '2024-07-22 16:20:37.781817');
INSERT INTO `group_message` VALUES (74, 'UNREAD', NULL, NULL, 'sdfsf', 8, 1, '2024-07-22 16:21:06.873366');
INSERT INTO `group_message` VALUES (75, 'UNREAD', NULL, NULL, 'sdfsfasd', 8, 1, '2024-07-22 16:21:44.045297');
INSERT INTO `group_message` VALUES (76, 'UNREAD', NULL, NULL, 'http://localhost:9999/home', 9, 1, '2024-07-22 16:34:58.146581');
INSERT INTO `group_message` VALUES (77, 'UNREAD', NULL, NULL, 'http://localhost:9999/homehttp://localhost:9999/home', 8, 1, '2024-07-22 16:35:10.880122');
INSERT INTO `group_message` VALUES (78, 'UNREAD', NULL, NULL, '32', 9, 1, '2024-07-24 21:47:27.108154');
INSERT INTO `group_message` VALUES (79, 'UNREAD', NULL, NULL, '3223', 9, 1, '2024-07-24 21:47:29.475038');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '菜单名',
  `url` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '路由',
  `sort` int NULL DEFAULT NULL COMMENT '排序',
  `parentId` int NULL DEFAULT NULL COMMENT '父节点',
  `menuCode` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '权限表示',
  `nodeType` int NOT NULL COMMENT '节点类型：0目录 1菜单 3按钮',
  `assemblyName` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NULL DEFAULT NULL COMMENT '组件名称',
  `assemblyUrl` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `isDeleted` tinyint NULL DEFAULT NULL COMMENT '是否被删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_51b63874cdce0d6898a0b2150f`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, '基础管理', '/base', NULL, 0, '', 0, NULL, NULL, NULL);
INSERT INTO `menu` VALUES (2, '角色管理', '/base/role', 73, 1, 'role', 1, 'Role', '/base/role/index', NULL);
INSERT INTO `menu` VALUES (6, '系统用户管理', '/base/systemUser', 73, 1, 'systemUser', 1, 'SystemUser', '/base/systemUser/index', NULL);

-- ----------------------------
-- Table structure for menu_role
-- ----------------------------
DROP TABLE IF EXISTS `menu_role`;
CREATE TABLE `menu_role`  (
  `roleId` int NOT NULL,
  `menuId` int NOT NULL,
  PRIMARY KEY (`roleId`, `menuId`) USING BTREE,
  INDEX `IDX_8db105cc6b80904ec27725e067`(`roleId` ASC) USING BTREE,
  INDEX `IDX_d64f57b754c31e43be03c4182b`(`menuId` ASC) USING BTREE,
  CONSTRAINT `FK_8db105cc6b80904ec27725e0676` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d64f57b754c31e43be03c4182bd` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu_role
-- ----------------------------
INSERT INTO `menu_role` VALUES (1, 1);
INSERT INTO `menu_role` VALUES (1, 2);
INSERT INTO `menu_role` VALUES (1, 6);

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `fileType` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件类型',
  `fileSize` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件大小',
  `postMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '聊天内容',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fromUserId` int NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int NULL DEFAULT NULL COMMENT '接收者(ID)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_c59262513a3006fd8f58bb4b7c2`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_96789153e31e0bb7885ea13a279`(`toUserId` ASC) USING BTREE,
  CONSTRAINT `FK_96789153e31e0bb7885ea13a279` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c59262513a3006fd8f58bb4b7c2` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 135 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
INSERT INTO `message` VALUES (120, NULL, NULL, 'fd', 'READ', '2024-05-09 03:03:36.887525', 1, 2);
INSERT INTO `message` VALUES (121, NULL, NULL, '6666234', 'READ', '2024-06-01 16:51:09.284668', 2, 1);
INSERT INTO `message` VALUES (122, NULL, NULL, 'dgdf', 'READ', '2024-06-02 16:16:39.804381', 1, 2);
INSERT INTO `message` VALUES (123, NULL, NULL, 'dfgdfg', 'READ', '2024-06-02 16:16:55.372904', 1, 2);
INSERT INTO `message` VALUES (124, NULL, NULL, 'dfgfd', 'READ', '2024-06-02 16:17:02.147999', 1, 2);
INSERT INTO `message` VALUES (125, NULL, NULL, 'dfgdfgdfg', 'READ', '2024-06-02 16:17:07.293280', 1, 2);
INSERT INTO `message` VALUES (126, NULL, NULL, '23', 'READ', '2024-06-02 16:52:17.193069', 1, 2);
INSERT INTO `message` VALUES (127, NULL, NULL, '2323', 'READ', '2024-06-02 16:59:28.616992', 1, 2);
INSERT INTO `message` VALUES (128, NULL, NULL, '213213\n', 'READ', '2024-07-22 15:20:30.775156', 1, 2);
INSERT INTO `message` VALUES (129, NULL, NULL, '111', 'READ', '2024-07-22 16:09:54.137831', 1, 2);
INSERT INTO `message` VALUES (130, NULL, NULL, '544dfg', 'READ', '2024-07-22 16:12:05.438649', 1, 2);
INSERT INTO `message` VALUES (131, NULL, NULL, '9869', 'READ', '2024-07-22 16:13:02.962000', 1, 2);
INSERT INTO `message` VALUES (132, NULL, NULL, 'aaa', 'READ', '2024-07-24 21:42:23.148638', 1, 2);
INSERT INTO `message` VALUES (133, NULL, NULL, 'sdf', 'READ', '2024-07-24 21:42:39.137754', 1, 2);
INSERT INTO `message` VALUES (134, NULL, NULL, '34', 'READ', '2024-07-24 21:46:26.059543', 1, 2);

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `friendMsgNumber` int NULL DEFAULT NULL COMMENT '对方发给我，我这边未读信息数量',
  `userMsgNumber` int NULL DEFAULT NULL COMMENT '自己发送给对方，对方未读信息数量',
  `msgType` enum('ONE_FOR_ONE','MANY_TO_MANY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ONE_FOR_ONE' COMMENT '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `state` enum('UNREAD','READ','WITHDRAW','DELETE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNREAD' COMMENT '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
  `newMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '最新的信息',
  `fromUserId` int NULL DEFAULT NULL COMMENT '发送者(ID)',
  `toUserId` int NULL DEFAULT NULL COMMENT '接收者(ID)',
  `groupId` int NULL DEFAULT NULL COMMENT '群id/同时是接收者id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_74b0f15aa3a83f8ef25f053ff0`(`toUserId` ASC, `fromUserId` ASC) USING BTREE,
  INDEX `FK_e3b1ce8ea3457922ac3d9266ba3`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_be9e12d1b6007810eacb135a964`(`groupId` ASC) USING BTREE,
  CONSTRAINT `FK_392760210d977325dc85150ceab` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_be9e12d1b6007810eacb135a964` FOREIGN KEY (`groupId`) REFERENCES `group_chat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e3b1ce8ea3457922ac3d9266ba3` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (25, NULL, NULL, 'ONE_FOR_ONE', '2024-07-24 21:46:26.000000', 'UNREAD', '34', 1, 2, NULL);
INSERT INTO `notice` VALUES (26, NULL, NULL, 'ONE_FOR_ONE', '2024-05-09 03:00:49.516206', 'UNREAD', '', 1, 3, NULL);
INSERT INTO `notice` VALUES (29, NULL, NULL, 'MANY_TO_MANY', '2024-07-22 16:35:10.000000', 'UNREAD', 'http://localhost:9999/homehttp://localhost:9999/home', 1, NULL, 8);
INSERT INTO `notice` VALUES (30, NULL, NULL, 'MANY_TO_MANY', '2024-07-24 21:47:29.000000', 'UNREAD', '3223', 1, NULL, 9);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '角色姓名',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (11, '即片不真装');
INSERT INTO `role` VALUES (9, '测试员1');
INSERT INTO `role` VALUES (4, '测试员2');
INSERT INTO `role` VALUES (5, '测试员3');
INSERT INTO `role` VALUES (7, '测试员4');
INSERT INTO `role` VALUES (2, '测试员5');
INSERT INTO `role` VALUES (3, '测试员6');
INSERT INTO `role` VALUES (8, '测试员7');
INSERT INTO `role` VALUES (10, '测试员8');
INSERT INTO `role` VALUES (1, '管理员');

-- ----------------------------
-- Table structure for systemUser_role
-- ----------------------------
DROP TABLE IF EXISTS `systemUser_role`;
CREATE TABLE `systemUser_role`  (
  `systemUserId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`systemUserId`, `roleId`) USING BTREE,
  INDEX `IDX_9df25f382bbdc5132ea2759001`(`systemUserId` ASC) USING BTREE,
  INDEX `IDX_f83ce7adac4d7b18693363444e`(`roleId` ASC) USING BTREE,
  CONSTRAINT `FK_9df25f382bbdc5132ea2759001e` FOREIGN KEY (`systemUserId`) REFERENCES `system_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_f83ce7adac4d7b18693363444e9` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of systemUser_role
-- ----------------------------
INSERT INTO `systemUser_role` VALUES (1, 1);
INSERT INTO `systemUser_role` VALUES (1, 2);
INSERT INTO `systemUser_role` VALUES (1, 3);
INSERT INTO `systemUser_role` VALUES (1, 4);
INSERT INTO `systemUser_role` VALUES (1, 5);
INSERT INTO `systemUser_role` VALUES (1, 7);
INSERT INTO `systemUser_role` VALUES (1, 8);
INSERT INTO `systemUser_role` VALUES (1, 9);
INSERT INTO `systemUser_role` VALUES (1, 10);
INSERT INTO `systemUser_role` VALUES (26, 1);

-- ----------------------------
-- Table structure for system_user
-- ----------------------------
DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_dbfcda425aea56cd4757db1c53`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of system_user
-- ----------------------------
INSERT INTO `system_user` VALUES (1, 'admin', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (3, '秦始皇', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (4, '刘邦', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (5, '王莽', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (6, '刘裕', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (7, '武周则', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (8, '赵匡胤', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (9, '赵匡胤1', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (11, '赵匡胤2', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (12, '赵匡胤4', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (13, '赵匡胤5', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (15, '赵匡胤6', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (19, '赵匡胤8', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (20, '赵匡胤9', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (21, '赵匡胤10', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (22, '赵匡胤11', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (23, '赵匡胤12', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (24, '系统用户1', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (25, '测试22', '675a3867bd36ed867d480551c1000dc4');
INSERT INTO `system_user` VALUES (26, '日方和事', '675a3867bd36ed867d480551c1000dc4');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `headerImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码',
  `gender` int NOT NULL COMMENT '性别',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_065d4d8f3b5adb4a08841eae3c`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
INSERT INTO `user` VALUES (17, '油京及什', '林秀兰', 'http://dummyimage.com/400x400', 'c6bc4282a03cab2c7ff5fb6012a3f0d3', 1);

SET FOREIGN_KEY_CHECKS = 1;
