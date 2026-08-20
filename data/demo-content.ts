import type {
  ActivityViewModel,
  AnnouncementViewModel,
  GalleryItemViewModel,
  ManagerViewModel,
  ServerViewModel
} from "~/types/view-models";

export const servers: ServerViewModel[] = [
  {
    id: "event",
    name: "活动服",
    gameplay: "每周速通 / 小游戏",
    category: "activity",
    status: "online",
    statusLabel: "活动中",
    online: 12,
    capacity: 30,
    address: "event.neko-mc.club",
    version: "1.21.1",
    pack: "不需要整合包",
    description: "每周速通挑战、小游戏和临时小组服都从这里进入。",
    rules: "速通期间禁止提前破坏出生点资源，分组以当晚公告为准。",
    icon: "event",
    featured: true
  },
  {
    id: "redstone",
    name: "生电服",
    gameplay: "长期生电 / 公共工程",
    category: "permanent",
    status: "online",
    statusLabel: "常驻",
    online: 5,
    capacity: 40,
    address: "redstone.neko-mc.club",
    version: "1.20.4",
    pack: "不需要整合包",
    description: "长期生电、材料生产线和公共工程建设。",
    rules: "公共机器先登记再改动，长期材料仓库按区域领取。",
    icon: "redstone"
  },
  {
    id: "adventure",
    name: "冒险组",
    gameplay: "模组合作 / 剧情探索",
    category: "activity",
    status: "online",
    statusLabel: "小组活动",
    online: 3,
    capacity: 20,
    address: "adventure.neko-mc.club",
    version: "1.20.1 Forge",
    pack: "QQ群文件：猫娘社冒险组整合包 v3",
    description: "冒险组、剧情探索和模组合作玩法。",
    rules: "进入前必须安装整合包，组队路线由当天队长确认。",
    icon: "adventure"
  },
  {
    id: "lobby",
    name: "大厅服",
    gameplay: "新人集合 / 传送入口",
    category: "permanent",
    status: "online",
    statusLabel: "新人入口",
    online: 1,
    capacity: 60,
    address: "play.neko-mc.club",
    version: "1.21.1",
    pack: "不需要整合包",
    description: "新人集合、公告牌、传送牌和基础教程入口。",
    rules: "新人先在大厅服阅读公告牌，再根据传送牌进入对应服务器。",
    icon: "lobby"
  },
  {
    id: "build",
    name: "建筑服",
    gameplay: "建筑 / 截图 / 慢节奏创作",
    category: "permanent",
    status: "available",
    statusLabel: "可进入",
    online: 0,
    capacity: 30,
    address: "build.neko-mc.club",
    version: "1.21.1",
    pack: "不需要整合包",
    description: "建筑、截图、社团展示区和慢节奏创作。",
    rules: "公共建筑请先登记位置，避免占用主路和公共景观。",
    icon: "build"
  },
  {
    id: "resource",
    name: "资源服",
    gameplay: "资源 / 采集 / 临时周目",
    category: "permanent",
    status: "maintenance",
    statusLabel: "维护中",
    online: 0,
    capacity: 30,
    address: "resource.neko-mc.club",
    version: "1.20.4",
    pack: "不需要整合包",
    description: "资源、养老、采集和临时周目，当前正在换周目。",
    rules: "维护期间不可进入，开放时间以公告栏维护通知为准。",
    icon: "resource"
  }
];

export const activities: ActivityViewModel[] = [
  {
    id: "weekly-speedrun",
    name: "本周速通挑战",
    kind: "weekly",
    status: "active",
    statusLabel: "正在进行",
    serverId: "event",
    time: "周六 19:45 集合，20:00 开局",
    participation: "直接复制活动服地址；新人先到大厅服集合",
    description: "玩家可以快速开玩、围观或补位，队长会在开始前确认分组和路线。",
    icon: "event",
    priority: 100
  },
  {
    id: "redstone-project",
    name: "生电公共工程",
    kind: "long-term",
    status: "ongoing",
    statusLabel: "长期进行",
    serverId: "redstone",
    time: "常驻开放",
    participation: "进入生电服后查看公共工程告示牌",
    description: "材料生产线、公共机器维护和大型工程协作。",
    icon: "redstone",
    priority: 80
  },
  {
    id: "adventure-team",
    name: "暮色探索小队",
    kind: "long-term",
    status: "ongoing",
    statusLabel: "组队中",
    serverId: "adventure",
    time: "每周五晚",
    participation: "先从 QQ 群文件下载冒险组整合包",
    description: "剧情探索、模组合作与小队推进。",
    icon: "adventure",
    requiresPack: true,
    priority: 70
  },
  {
    id: "build-gallery",
    name: "建筑展示区",
    kind: "long-term",
    status: "ongoing",
    statusLabel: "长期开放",
    serverId: "build",
    time: "随时可参加",
    participation: "进入建筑服，先登记建筑位置",
    description: "慢节奏建筑、截图和社团展示内容整理。",
    icon: "build",
    priority: 60
  },
  {
    id: "block-relay",
    name: "方块接力赛",
    kind: "limited",
    status: "upcoming",
    statusLabel: "即将开始",
    serverId: "event",
    time: "下周三 20:00",
    participation: "活动群内报名",
    description: "分组完成采集、合成和搭建任务。",
    icon: "event",
    priority: 50
  }
];

export const announcements: AnnouncementViewModel[] = [
  { id: "speedrun", title: "本周速通挑战今晚开局", category: "event", categoryLabel: "活动通知", publishedAt: "今天 18:20", summary: "活动服 20:00 开放，19:45 到大厅服集合。", priority: 100, pinned: true },
  { id: "resource", title: "资源服换周目维护", category: "maintenance", categoryLabel: "维护通知", publishedAt: "昨天 22:10", summary: "资源服预计维护到周五晚，期间暂不可进入。", priority: 80 },
  { id: "lobby", title: "大厅服新增传送牌", category: "update", categoryLabel: "服务器更新", publishedAt: "周三 12:30", summary: "新人可直接从大厅服查看所有服务器入口。", priority: 60 },
  { id: "duty", title: "本周值班管理安排", category: "club", categoryLabel: "社团通知", publishedAt: "周一 09:00", summary: "皮肤站、活动和技术问题请按事项联系。", priority: 40 }
];

export const managers: ManagerViewModel[] = [
  { id: "skin", name: "小樱", contact: "QQ 12345678", responsibilities: "皮肤站 / 注册 / 邀请码" },
  { id: "tech", name: "石英", contact: "QQ 23456789", responsibilities: "开服 / 技术 / 整合包" },
  { id: "event", name: "木牌", contact: "QQ 34567890", responsibilities: "活动 / 规则 / 值班" }
];

export const galleryItems: GalleryItemViewModel[] = [
  { id: "speedrun", title: "夏季速通夜", meta: "7 月 5 日 · 活动服", image: "/assets_activity-speedrun-image2.webp", alt: "夏季速通夜活动场景", featured: true },
  { id: "adventure", title: "暮色冒险组", meta: "6 月 28 日 · 冒险组", image: "/assets/bg-neko-portal-soft.webp", alt: "暮色冒险组活动场景" },
  { id: "build", title: "木屋建筑赛", meta: "6 月 16 日 · 建筑服", image: "/assets/bg-neko-corner-soft.webp", alt: "木屋建筑赛活动场景" },
  { id: "minigame", title: "方块接力赛", meta: "6 月 8 日 · 活动服", image: "/image-gpt-image-2-mr831dx0.webp", alt: "方块接力赛活动场景" }
];
