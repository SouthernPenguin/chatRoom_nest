import { SelectQueryBuilder } from 'typeorm';

export const conditionUtilsLike = <T>(queryBuilder: SelectQueryBuilder<T>, arr: any[], entityName: string) => {
  arr.forEach(item => {
    if (item.value) {
      queryBuilder.andWhere(`${entityName}.${item.field} Like:${item.field}`, {
        [item.field]: `%${item.value}%`,
      });
    }
  });
  return queryBuilder;
};

export const conditionUtilsSelect = <T>(queryBuilder: SelectQueryBuilder<T>, arr: any[], entityName: string) => {
  arr.forEach(item => {
    if (item.value) {
      queryBuilder.andWhere(`${entityName}.${item.field} = :${item.field}`, {
        [item.field]: item.value,
      });
    }
  });
  return queryBuilder;
};
