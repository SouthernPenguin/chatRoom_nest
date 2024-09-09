type token = { username: string; id: number; roleId: number[] };
export const getTokenUser = async (req: Request): Promise<token> => {
  if (req && 'user' in req) {
    return req['user'] as token;
  }
  // throw new UnauthorizedException('token 过期');
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)) as any);

  return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
};

/**
 * 生成树状图
 * @param list 数组
 * @param parentId 分类id
 * @returns Array
 */
export const menuTree = (
  list: any[],
  parentId: number | null,
): any[] | string => {
  if (list.length < 0) return '请传入数组';
  const returnList: any[] = [];
  list.forEach((item) => {
    if (
      item.parent_id === parentId &&
      (item.isDeleted === 0 || !item.isDeleted)
    ) {
      item.children = menuTree(list, item.id);
      returnList.push(item);
    }
  });
  return returnList;
};
