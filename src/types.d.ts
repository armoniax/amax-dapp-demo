declare interface PermissionLevel {
  actor: string;
  permission: Permission;
  publicKey?: string;
}

declare type Permission = "active" | "owner";

declare interface Action {
  account: string; // 合约地址
  name: string; // 合约方法
  authorization?: PermissionLevel[]; // 授权
  data: any; // 合约方法的参数
}

declare interface StoreType {
  global: StoreGlobal;
}

declare interface StoreGlobal {
  account?: PermissionLevel;
  wallet?: string;
  selectAction?: Action;
  armadilloDate: { [key: string]: any };
}

declare interface WalletListItem {
  title: string;
  icon: any;
  id: string;
}

declare interface GetTableRowsParams {
  code: string; // 智能合约名称
  table: string; // 要查询的表名
  scope: string; // 此数据所属的帐户
  index_position: number; //使用索引的位置
  key_type?: string; // index_position 指定的键类型
  encode_type?: string; //编码类型
  lower_bound?: string; //过滤结果以返回第一个不小于集合中提供值的元素
  upper_bound?: string; //过滤结果以返回第一个大于集合中提供值的元素
  limit?: number; //限制返回的结果数
  reverse?: boolean; //颠倒返回结果的顺序
  show_payer?: boolean; //显示 RAM 付款人
  json?: boolean; // 返回数据格式
}
