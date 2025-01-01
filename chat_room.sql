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

 Date: 01/01/2025 16:00:51
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
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `userMsgNumber` int NULL DEFAULT NULL COMMENT '自己发送给对方，对方未读信息数量',
  `friendMsgNumber` int NULL DEFAULT NULL COMMENT '对方发给我，我这边未读信息数量',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_26df3e1d8b7428b9d601194839`(`userId` ASC, `friendId` ASC, `sortedKey` ASC) USING BTREE,
  INDEX `FK_7dfc010217195c6bc513a387b5d`(`fromUserId` ASC) USING BTREE,
  CONSTRAINT `FK_7dfc010217195c6bc513a387b5d` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of friend_ship
-- ----------------------------
INSERT INTO `friend_ship` VALUES (48, 2, 27, '2-27', 'PASS', 2, 'amet', NULL, NULL, '2024-10-20 19:57:24.487219');
INSERT INTO `friend_ship` VALUES (53, 1, 27, '1-27', 'PASS', 1, 'eu magna dolor elit', NULL, NULL, '2024-10-21 22:33:44.135529');

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
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_chat
-- ----------------------------
INSERT INTO `group_chat` VALUES (15, '产克太市花月,数斯常老力条', NULL, 27);

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
INSERT INTO `group_chat_user` VALUES (15, 1, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (15, 2, 0, NULL, NULL, NULL);
INSERT INTO `group_chat_user` VALUES (15, 27, 0, NULL, NULL, NULL);

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
  `nodeType` int NOT NULL COMMENT '节点类型：0目录 1菜单 2按钮',
  `assemblyName` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NULL DEFAULT NULL COMMENT '组件名称',
  `assemblyUrl` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `isDeleted` tinyint NULL DEFAULT NULL COMMENT '是否被删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_51b63874cdce0d6898a0b2150f`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, '基础管理', '/base', 1, 0, 'base', 0, 'Layout', NULL, NULL);
INSERT INTO `menu` VALUES (2, '角色管理', '/base/role', 73, 1, 'role', 1, 'Role', 'base/role/index', NULL);
INSERT INTO `menu` VALUES (6, '系统用户管理', '/base/systemUser', 73, 1, 'systemUser', 1, 'SystemUser', 'base/systemUser/index', NULL);
INSERT INTO `menu` VALUES (7, '菜单管理', '/base/menu', 75, 1, 'menu', 1, 'Menu', 'base/menu/index', NULL);
INSERT INTO `menu` VALUES (8, '聊天管理', '/chatRoom', 1, 0, 'chatRoom', 0, 'Layout', '', NULL);
INSERT INTO `menu` VALUES (9, '测试CRUD目录', '/testCurd', 1, 0, 'ceshi', 0, 'Layout', '', NULL);
INSERT INTO `menu` VALUES (12, '测试目录1', '/ceshi1', 1, 0, 'ceshi1', 0, 'Layout', '', NULL);
INSERT INTO `menu` VALUES (15, 'crud', '/testCurd/index', 0, 9, 'crud', 1, 'TestCurd', 'testCurd/index', NULL);

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
INSERT INTO `menu_role` VALUES (1, 7);
INSERT INTO `menu_role` VALUES (1, 8);
INSERT INTO `menu_role` VALUES (2, 1);
INSERT INTO `menu_role` VALUES (2, 2);
INSERT INTO `menu_role` VALUES (2, 6);
INSERT INTO `menu_role` VALUES (2, 7);
INSERT INTO `menu_role` VALUES (3, 1);
INSERT INTO `menu_role` VALUES (3, 2);
INSERT INTO `menu_role` VALUES (3, 6);
INSERT INTO `menu_role` VALUES (3, 7);
INSERT INTO `menu_role` VALUES (4, 8);
INSERT INTO `menu_role` VALUES (5, 8);
INSERT INTO `menu_role` VALUES (8, 8);
INSERT INTO `menu_role` VALUES (10, 6);
INSERT INTO `menu_role` VALUES (10, 8);
INSERT INTO `menu_role` VALUES (11, 6);
INSERT INTO `menu_role` VALUES (11, 8);
INSERT INTO `menu_role` VALUES (18, 1);
INSERT INTO `menu_role` VALUES (18, 2);
INSERT INTO `menu_role` VALUES (18, 6);
INSERT INTO `menu_role` VALUES (18, 7);

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
  `originalFileName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '原始文件名称',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_c59262513a3006fd8f58bb4b7c2`(`fromUserId` ASC) USING BTREE,
  INDEX `FK_96789153e31e0bb7885ea13a279`(`toUserId` ASC) USING BTREE,
  CONSTRAINT `FK_96789153e31e0bb7885ea13a279` FOREIGN KEY (`toUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c59262513a3006fd8f58bb4b7c2` FOREIGN KEY (`fromUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 215 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (143, NULL, NULL, '345', 'UNREAD', '2024-10-30 14:43:02.070819', 2, 27, NULL);
INSERT INTO `message` VALUES (144, NULL, NULL, '345', 'UNREAD', '2024-10-30 14:43:45.323869', 27, 2, NULL);
INSERT INTO `message` VALUES (145, NULL, NULL, '567567', 'UNREAD', '2024-10-30 14:45:21.015189', 27, 2, NULL);
INSERT INTO `message` VALUES (146, NULL, NULL, 'werw', 'UNREAD', '2024-10-30 14:48:02.878809', 27, 2, NULL);
INSERT INTO `message` VALUES (147, NULL, NULL, '65', 'UNREAD', '2024-10-30 14:48:32.768190', 27, 2, NULL);
INSERT INTO `message` VALUES (148, NULL, NULL, '565', 'UNREAD', '2024-10-30 14:49:43.542136', 2, 27, NULL);
INSERT INTO `message` VALUES (149, NULL, NULL, '+++++++', 'WITHDRAW', '2024-10-30 14:54:55.000000', 2, 27, NULL);
INSERT INTO `message` VALUES (150, NULL, NULL, '-----------', 'UNREAD', '2024-10-30 14:52:12.180254', 27, 2, NULL);
INSERT INTO `message` VALUES (151, NULL, NULL, 'dfsdfd\n', 'UNREAD', '2024-10-30 15:08:34.342791', 27, 2, NULL);
INSERT INTO `message` VALUES (152, NULL, NULL, 'rtyryrtytr1', 'UNREAD', '2024-10-30 15:08:43.054669', 2, 27, NULL);
INSERT INTO `message` VALUES (153, NULL, NULL, 'rtytryrtyrty2', 'UNREAD', '2024-10-30 15:08:46.102301', 2, 27, NULL);
INSERT INTO `message` VALUES (154, NULL, NULL, 'rtyrtyrtyrty3', 'UNREAD', '2024-10-30 15:08:48.504205', 2, 27, NULL);
INSERT INTO `message` VALUES (155, NULL, NULL, 'rtyrtyrtyrt4', 'UNREAD', '2024-10-30 15:08:52.559151', 2, 27, NULL);
INSERT INTO `message` VALUES (156, NULL, NULL, '56756765', 'UNREAD', '2024-10-30 15:14:14.295209', 2, 27, NULL);
INSERT INTO `message` VALUES (157, NULL, NULL, '567567567', 'UNREAD', '2024-10-30 15:14:18.434750', 2, 27, NULL);
INSERT INTO `message` VALUES (158, NULL, NULL, '567567', 'UNREAD', '2024-10-30 15:14:40.561402', 2, 27, NULL);
INSERT INTO `message` VALUES (159, NULL, NULL, '456565', 'UNREAD', '2024-10-30 16:34:06.736911', 2, 27, NULL);
INSERT INTO `message` VALUES (160, NULL, NULL, 'hhh', 'UNREAD', '2024-10-30 16:34:45.618392', 2, 27, NULL);
INSERT INTO `message` VALUES (161, NULL, NULL, '345435', 'UNREAD', '2024-10-30 16:35:57.182749', 27, 2, NULL);
INSERT INTO `message` VALUES (162, NULL, NULL, 'gdfg ', 'UNREAD', '2024-10-30 16:37:07.623561', 2, 27, NULL);
INSERT INTO `message` VALUES (163, NULL, NULL, '&&&&&', 'UNREAD', '2024-10-30 16:38:25.122446', 27, 2, NULL);
INSERT INTO `message` VALUES (164, NULL, NULL, '67867867', 'UNREAD', '2024-10-30 16:38:59.831178', 2, 27, NULL);
INSERT INTO `message` VALUES (165, NULL, NULL, '4', 'UNREAD', '2024-10-30 16:39:24.785375', 2, 27, NULL);
INSERT INTO `message` VALUES (166, NULL, NULL, 'fsdfsd ', 'UNREAD', '2024-10-30 16:48:38.964297', 2, 27, NULL);
INSERT INTO `message` VALUES (167, NULL, NULL, 'rtt', 'UNREAD', '2024-10-30 16:50:50.217319', 2, 27, NULL);
INSERT INTO `message` VALUES (168, NULL, NULL, '4535435', 'UNREAD', '2024-10-30 16:50:56.691029', 2, 27, NULL);
INSERT INTO `message` VALUES (169, NULL, NULL, '梵蒂冈地方官', 'UNREAD', '2024-10-30 17:07:31.763929', 27, 2, NULL);
INSERT INTO `message` VALUES (171, NULL, NULL, 'asdad', 'UNREAD', '2024-11-16 22:11:28.746048', 27, 1, NULL);
INSERT INTO `message` VALUES (172, NULL, NULL, '45675634567', 'WITHDRAW', '2024-11-16 22:11:35.094763', 1, 27, NULL);
INSERT INTO `message` VALUES (173, 'jpeg', '2.34 MB', 'http://127.0.0.1:9000/files/image/2024-11-19/23a086cf-c3d1-4da2-8baf-f1326d3e27b2.jpeg', 'UNREAD', '2024-11-19 20:55:50.981486', 27, 1, NULL);
INSERT INTO `message` VALUES (174, NULL, NULL, '33', 'UNREAD', '2024-11-19 20:57:01.211406', 27, 1, NULL);
INSERT INTO `message` VALUES (175, 'png', '64.97 KB', 'http://127.0.0.1:9000/files//image/2024-11-19/72bd8b81-5d01-45bf-be01-7d7827b39442.png', 'UNREAD', '2024-11-19 21:37:52.577722', 1, 27, NULL);
INSERT INTO `message` VALUES (176, NULL, NULL, '4', 'UNREAD', '2024-11-19 21:38:22.186824', 1, 27, NULL);
INSERT INTO `message` VALUES (177, 'png', '189.16 KB', 'http://127.0.0.1:9000/files//image/2024-11-19/3a7521bb-00d5-4dec-8b90-1169b65b8bd9.png', 'UNREAD', '2024-11-19 21:39:11.119169', 1, 27, NULL);
INSERT INTO `message` VALUES (182, 'png', '3.02 MB', 'http://127.0.0.1:9000/files//image/2024-11-19/736ac499-42a1-470d-8823-b7f8ae089dd2.png', 'UNREAD', '2024-11-19 21:50:37.232413', 1, 27, NULL);
INSERT INTO `message` VALUES (183, 'png', '16.67 KB', 'http://127.0.0.1:9000/files//image/2024-11-19/2a062176-f118-4ae3-b951-51c4db2ff26d.png', 'UNREAD', '2024-11-19 21:57:38.838884', 27, 1, NULL);
INSERT INTO `message` VALUES (184, 'png', '119.57 KB', 'http://127.0.0.1:9000/files//image/2024-11-19/9e9727d3-3a4d-4d9b-8e6a-61ee92c3af59.png', 'UNREAD', '2024-11-19 22:21:51.865852', 27, 1, NULL);
INSERT INTO `message` VALUES (185, 'png', '42.99 KB', 'http://127.0.0.1:9000/files//image/2024-11-19/7b441f8e-2c34-471d-a786-9699fb585d0a.png', 'UNREAD', '2024-11-19 22:22:11.071508', 27, 1, NULL);
INSERT INTO `message` VALUES (186, 'xlsx', '14.64 KB', 'http://127.0.0.1:9000/files//office/2024-11-23/4608357d-2ca0-4edc-9409-21c5a782b622.xlsx', 'UNREAD', '2024-11-23 22:36:09.739977', 27, 1, 'ss.xlsx');
INSERT INTO `message` VALUES (187, 'pptx', '34.99 KB', 'http://127.0.0.1:9000/files//office/2024-11-23/e33421bc-3cae-46ae-b56f-dd12d1abd482.pptx', 'UNREAD', '2024-11-23 23:23:40.991625', 27, 1, '新建 PPT 演示文0.pptx');
INSERT INTO `message` VALUES (188, 'ppt', '20.5 KB', 'http://127.0.0.1:9000/files//office/2024-11-23/ea67b7ba-edd9-4f2c-9bd8-43b5708aae4d.ppt', 'UNREAD', '2024-11-23 23:29:32.525741', 27, 1, '新建 PPT 演示文稿1.ppt');
INSERT INTO `message` VALUES (189, NULL, NULL, '23', 'WITHDRAW', '2024-11-23 23:31:43.617844', 27, 1, NULL);
INSERT INTO `message` VALUES (190, NULL, NULL, '34', 'WITHDRAW', '2024-11-23 23:33:20.113405', 27, 1, NULL);
INSERT INTO `message` VALUES (191, NULL, NULL, '233', 'UNREAD', '2024-11-23 23:34:09.631307', 27, 1, NULL);
INSERT INTO `message` VALUES (192, NULL, NULL, '撒大苏打', 'UNREAD', '2024-11-23 23:34:13.206461', 27, 1, NULL);
INSERT INTO `message` VALUES (193, 'xlsx', '16.8 KB', 'http://127.0.0.1:9000/files//office/2024-12-15/c372ef6e-d241-4249-b49d-ca4d7177857e.xlsx', 'UNREAD', '2024-12-15 20:19:00.103867', 27, 1, '差旅费报销明细表--样表.xlsx');
INSERT INTO `message` VALUES (194, NULL, NULL, 'sfsfd', 'UNREAD', '2024-12-17 19:53:36.941057', 27, 1, NULL);
INSERT INTO `message` VALUES (195, NULL, NULL, 'assadsd', 'UNREAD', '2024-12-17 19:53:45.319433', 1, 27, NULL);
INSERT INTO `message` VALUES (196, NULL, NULL, 'rr', 'UNREAD', '2024-12-17 20:10:30.564848', 1, 27, NULL);
INSERT INTO `message` VALUES (197, NULL, NULL, 'fff', 'UNREAD', '2024-12-17 20:12:16.812147', 1, 27, NULL);
INSERT INTO `message` VALUES (198, NULL, NULL, 'asdasd', 'UNREAD', '2024-12-17 20:12:22.673558', 1, 27, NULL);
INSERT INTO `message` VALUES (199, NULL, NULL, 'asdsa', 'UNREAD', '2024-12-17 20:12:45.602498', 1, 27, NULL);
INSERT INTO `message` VALUES (200, NULL, NULL, 'dsfds', 'WITHDRAW', '2024-12-17 20:15:18.907641', 1, 27, NULL);
INSERT INTO `message` VALUES (201, NULL, NULL, '三十分大师', 'WITHDRAW', '2024-12-17 20:15:52.960245', 27, 1, NULL);
INSERT INTO `message` VALUES (202, NULL, NULL, '啊实打实打算', 'WITHDRAW', '2024-12-17 20:16:18.435357', 27, 1, NULL);
INSERT INTO `message` VALUES (203, NULL, NULL, '阿斯顿撒', 'WITHDRAW', '2024-12-17 20:19:19.137151', 27, 1, NULL);
INSERT INTO `message` VALUES (204, NULL, NULL, '34324', 'WITHDRAW', '2024-12-17 20:21:04.183487', 27, 1, NULL);
INSERT INTO `message` VALUES (205, NULL, NULL, 'sada', 'WITHDRAW', '2024-12-17 20:22:23.908656', 1, 27, NULL);
INSERT INTO `message` VALUES (206, NULL, NULL, '3435345', 'WITHDRAW', '2024-12-17 20:37:13.538892', 1, 27, NULL);
INSERT INTO `message` VALUES (207, NULL, NULL, '谔谔谔', 'UNREAD', '2024-12-18 21:22:23.795873', 27, 1, NULL);
INSERT INTO `message` VALUES (208, NULL, NULL, 'erefsdfds\n', 'UNREAD', '2024-12-18 21:55:13.094611', 1, 27, NULL);
INSERT INTO `message` VALUES (209, NULL, NULL, 'awd', 'UNREAD', '2024-12-18 22:27:52.830488', 1, 27, NULL);
INSERT INTO `message` VALUES (210, NULL, NULL, '第三方的', 'UNREAD', '2024-12-18 22:28:51.636649', 27, 1, NULL);
INSERT INTO `message` VALUES (211, NULL, NULL, 's', 'UNREAD', '2024-12-18 22:29:46.270709', 1, 27, NULL);
INSERT INTO `message` VALUES (212, NULL, NULL, 'asdasd', 'UNREAD', '2024-12-18 22:31:04.208232', 1, 27, NULL);
INSERT INTO `message` VALUES (213, NULL, NULL, '9999999999', 'UNREAD', '2024-12-20 14:15:12.035568', 27, 1, NULL);
INSERT INTO `message` VALUES (214, NULL, NULL, '++++++++++', 'UNREAD', '2024-12-20 14:16:08.545678', 1, 27, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (31, NULL, NULL, 'ONE_FOR_ONE', '2024-12-20 14:16:08.000000', 'UNREAD', '++++++++++', 27, 1, NULL);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '角色姓名',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '管理员', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (2, '测试员5', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (3, '测试员6', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (4, '测试员2', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (5, '测试员3', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (7, '测试员4', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (8, '测试员7', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (9, '测试员1', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (10, '测试员8', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (11, '即片不真装', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (13, '从', '2024-09-17 22:28:24.437003');
INSERT INTO `role` VALUES (18, ' 管理员', '2024-09-18 15:19:48.797609');

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
INSERT INTO `systemUser_role` VALUES (3, 1);
INSERT INTO `systemUser_role` VALUES (3, 2);
INSERT INTO `systemUser_role` VALUES (3, 3);
INSERT INTO `systemUser_role` VALUES (3, 4);
INSERT INTO `systemUser_role` VALUES (28, 1);
INSERT INTO `systemUser_role` VALUES (29, 3);
INSERT INTO `systemUser_role` VALUES (29, 5);
INSERT INTO `systemUser_role` VALUES (30, 3);
INSERT INTO `systemUser_role` VALUES (30, 5);
INSERT INTO `systemUser_role` VALUES (31, 2);

-- ----------------------------
-- Table structure for system_user
-- ----------------------------
DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT '密码',
  `createdTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_dbfcda425aea56cd4757db1c53`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of system_user
-- ----------------------------
INSERT INTO `system_user` VALUES (1, 'admin', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (3, '秦始皇', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (4, '刘邦', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (5, '王莽', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (6, '刘裕', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (7, '武周则', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (8, '赵匡胤', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (9, '赵匡胤1', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (11, '赵匡胤2', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (12, '赵匡胤4', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (13, '赵匡胤5', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (15, '赵匡胤6', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (19, '赵匡胤8', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (20, '赵匡胤9', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (21, '赵匡胤10', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (22, '赵匡胤11', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (23, '赵匡胤12', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (24, '系统用户1', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (25, '测试22', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (26, '日方和事', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (27, '撒大沙发', '675a3867bd36ed867d480551c1000dc4', '2024-09-21 21:58:42.934598');
INSERT INTO `system_user` VALUES (28, '撒大苏打', '675a3867bd36ed867d480551c1000dc4', '2024-09-22 13:34:14.389931');
INSERT INTO `system_user` VALUES (29, '啊实打实的', '675a3867bd36ed867d480551c1000dc4', '2024-09-22 13:35:24.195198');
INSERT INTO `system_user` VALUES (30, '撒旦撒旦', '675a3867bd36ed867d480551c1000dc4', '2024-09-22 13:49:40.574962');
INSERT INTO `system_user` VALUES (31, '是的', '675a3867bd36ed867d480551c1000dc4', '2024-09-22 13:50:06.846610');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `headerImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `gender` int NULL DEFAULT NULL COMMENT '性别',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_065d4d8f3b5adb4a08841eae3c`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '产克太市花月', 'http://127.0.0.1:9000/files//image/2024-11-17/e0f43422-739a-4649-8b3f-973b5db6bcda.jpeg', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (2, '数斯常老力条', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1, '');
INSERT INTO `user` VALUES (3, '子需统论其族切', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1, '');
INSERT INTO `user` VALUES (4, '不土般需候八', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (5, '还京严我飞油', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 2, '');
INSERT INTO `user` VALUES (6, '候说位解前温去', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (7, '况品会再', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (8, '员速增地速的', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1, '');
INSERT INTO `user` VALUES (9, '分已照说', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (10, '较行你级', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 2, '');
INSERT INTO `user` VALUES (11, '长几青直', 'http://dummyimage.com/400x400', '12531fe7eb88a448b9e457eaf6cc2bc6', 1, '');
INSERT INTO `user` VALUES (12, '明严属对', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (13, '断今或用南整', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1, '');
INSERT INTO `user` VALUES (14, '严该口低厂组', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (15, '现得交联农', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 1, '');
INSERT INTO `user` VALUES (16, '自龙完子调人', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', 0, '');
INSERT INTO `user` VALUES (17, '油京及什', 'http://dummyimage.com/400x400', 'c6bc4282a03cab2c7ff5fb6012a3f0d3', 1, '');
INSERT INTO `user` VALUES (18, '形理记派效记', 'http://dummyimage.com/400x400', 'c4a5332faf1df6153701036de62d4d6f', 0, '');
INSERT INTO `user` VALUES (19, '规心求制件再', NULL, '3e26790d6b5f61cb81c48ff40b9515fe', NULL, NULL);
INSERT INTO `user` VALUES (20, 'e2', NULL, 'c853fd8c75b08fb57c40be96715f17ed', NULL, NULL);
INSERT INTO `user` VALUES (21, '防守对方的', NULL, '675a3867bd36ed867d480551c1000dc4', NULL, NULL);
INSERT INTO `user` VALUES (22, '防守对方的1', NULL, '675a3867bd36ed867d480551c1000dc4', NULL, NULL);
INSERT INTO `user` VALUES (23, '防守对方的2', NULL, '675a3867bd36ed867d480551c1000dc4', NULL, NULL);
INSERT INTO `user` VALUES (24, 'eEWQ', NULL, '675a3867bd36ed867d480551c1000dc4', NULL, NULL);
INSERT INTO `user` VALUES (25, '钱钱钱', NULL, '93b405b4abe05c1498e089a5441d1a78', NULL, NULL);
INSERT INTO `user` VALUES (26, 'easdasdas', NULL, '675a3867bd36ed867d480551c1000dc4', NULL, NULL);
INSERT INTO `user` VALUES (27, 'admin', 'http://dummyimage.com/400x400', '675a3867bd36ed867d480551c1000dc4', NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
