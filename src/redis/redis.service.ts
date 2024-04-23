import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import redConfigFile from 'src/utils/redConfigFile';
import { HashSetDto } from './dto/hash-set.dot';

const mySqlConfig: any = redConfigFile();

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost', // Redis 服务器的主机名
      port: mySqlConfig.REDIS.prot, // Redis 服务器的端口
      password: mySqlConfig.REDIS.password,
    });
  }

  setValue(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  getValue(key: string) {
    return this.redisClient.get(key);
  }

  setList(hashSet: HashSetDto) {
    return this.redisClient.sadd('activeUser', [JSON.stringify(hashSet)]);
  }

  async getAllActiveUser() {
    return await this.redisClient.smembers('activeUser');
  }

  async deleteActiveUserItem(value: string) {
    const rse = await this.redisClient.srem('sdsdf', value);
    return rse;
  }
}
