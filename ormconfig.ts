import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import redConfigFile from 'src/utils/redConfigFile';
import { FriendShip } from 'src/friend-ship/entities/friend-ship.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { Notice } from 'src/notification/entities/notice.entity';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { GroupMessage } from 'src/group-message/entities/group-message.entity';
// import { GroupChatUser } from 'src/group-chat/entities/group-chat-user';

const mySqlConfig: any = redConfigFile();

export const connectionParams = {
  type: 'mysql', // 数据库类型
  host: mySqlConfig.db.mysql.host, // 域名
  port: mySqlConfig.db.mysql.prot, // 端口
  username: mySqlConfig.db.mysql.username, // 数据库名字
  password: mySqlConfig.db.mysql.password, // 数据库密码
  database: mySqlConfig.db.mysql.database, // 库名
  name: 'default',
  entities: [
    User,
    FriendShip,
    Message,
    Notice,
    GroupChat,
    GroupMessage,
    // GroupChatUser,
  ], // 导入的实体(数据库模型)
  synchronize: true,
  // 日志等级
  logging: true, //['query', 'error'],
} as TypeOrmModuleOptions;

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
