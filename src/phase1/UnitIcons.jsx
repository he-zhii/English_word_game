import {
  Briefcase,
  UserCheck,
  Building2,
  Hammer,
  CloudSun,
  Shirt,
  School,
  Sofa,
  Clock,
  ShoppingBag,
  Carrot,
  Soup,
  ListOrdered
} from 'lucide-react';

// 四年级单元图标：统一改用 Lucide 线性图标，与三年级保持同一套视觉语言。
// 相比原手写彩色填充 SVG，优势：
// 1. 描边粗细一致，自动响应 strokeWidth/size/color 等 props；
// 2. 使用 currentColor，能继承单元卡片的 themeColor；
// 3. 在 29×29 的小尺寸下依然清晰，不会细节糊成一团。
export const UNIT_ICONS = {
  Briefcase,      // 四上 U1 职业与家务
  UserCheck,      // 四上 U2 朋友与我
  Building2,      // 四上 U3 社区场所
  Hammer,         // 四上 U4 城市职业
  CloudSun,       // 四上 U5 天气与活动
  Shirt,          // 四上 U6 衣物与季节
  School,         // 四下 U1 教室规则
  Sofa,           // 四下 U2 我的家
  Clock,          // 四下 U3 学校作息
  ShoppingBag,    // 四下 U4 购物衣物
  Carrot,         // 四下 U5 农场与食物
  Soup,           // 四下 U6 饮食餐桌
  ListOrdered     // 四下 U7 数字专题
};

export default UNIT_ICONS;
