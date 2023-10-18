import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as _ from 'lodash';

import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

// 根据不同环境读取不同配置
const YML_CONFIG_FILE = 'config.yml';
const YML_NODE_ENV = `config.${
  process.env.NODE_ENV === 'development' ? 'development' : 'production'
}.yml`;

const envConfig = yaml.load(
  fs.readFileSync(path.join('config', YML_NODE_ENV), 'utf-8'),
);
const config = yaml.load(
  fs.readFileSync(path.join('config', YML_CONFIG_FILE), 'utf-8'),
);
// 合并配置
const mySqlConfig: any = _.merge(config, envConfig);

export const connectionParams = {
  type: 'mysql', // 数据库类型
  host: mySqlConfig.db.mysql.host, // 域名
  port: mySqlConfig.db.mysql.prot, // 端口
  username: mySqlConfig.db.mysql.username, // 数据库名字
  password: mySqlConfig.db.mysql.password, // 数据库密码
  database: mySqlConfig.db.mysql.database, // 库名
  entities: [User], // 导入的实体(数据库模型)
  synchronize: true,
  // 日志等级
  logging: true, //['query', 'error'],
} as TypeOrmModuleOptions;

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
