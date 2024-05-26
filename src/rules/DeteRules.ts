import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint()
export class DateRules implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    // 此处编写自定义的日期时间格式校验逻辑
    // 例如，你可以使用正则表达式来校验特定格式的日期时间字符串
    // 这里给出的示例只是一个简单的实现，你可能需要根据你的具体需求进行修改
    if (text) {
      return /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(text);
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'The date must be in the format YYYY-MM-DD HH:MM:SS';
  }
}
