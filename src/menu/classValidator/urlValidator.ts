import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'urlValidation', async: false })
export class UrlValidation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const node_type = args.object[args.constraints[0]];
    if (node_type === 3) {
      return true;
    }
    if (!value) {
      return false;
    }
    return true;
    // 返回 true 或 false，表示验证通过或失败
  }

  defaultMessage(): string {
    // 自定义错误消息，如果验证失败会返回该消息
    return '路径必须填写';
  }
}
