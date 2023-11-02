import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as _ from 'lodash';

const redConfigFile = () => {
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
  return _.merge(config, envConfig);
};

export default redConfigFile;
