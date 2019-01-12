/**
 * @file 左侧菜单栏的配置，被menu.vue读取
 */

const menuConfig =[
  
  {
    index: 1,
    title: "比赛管理",
    groups: [
      {
        title: "",
        list: [
          { title: "游戏配置", path: "/game-config", isHidden: false }, 
          { title: "比赛列表", path: "/match-record", isHidden: false }, 
          { title: "结算订单", path: "/settlement-order", isHidden: false }, 
          { title: "下注收益统计", path: "/bet-statistics", isHidden: false },
          { title: "非正即反收益统计", path: "/gold-coin", isHidden: false },
        ]
      }
    ]
  },

  {
    index: 2,
    title: "游戏管理",
    groups: [
      {
        title: "",
        list: [
          { title: "英雄管理", path: "/game-hero", isHidden: false }, 
          { title: "小游戏管理", path: "/game-management", isHidden: false }, 
          { title: "福利码管理", path: "/welfare", isHidden: false }, 
        ]
      }
    ]
  },

  // {
  //   index: 3,
  //   title: "转盘管理",
  //   groups: [
  //     {
  //       title: "",
  //       list: [
  //         { title: "转盘配置", path: "/turntable-config", isHidden: false }, 
  //         { title: "转盘数据统计", path: "/turntable-statistics", isHidden: false },
  //         { title: "转盘参与记录", path: "/turntable-record", isHidden: false }, 
  //         { title: "小游戏数据统计", path: "/game-statistics", isHidden: false }, 
  //       ]
  //     }
  //   ]
  // },

  {
    index: 3,
    title: "拼购管理",
    groups: [
      {
        title: "",
        list: [
          { title: "拼购配置", path: "/group-purchase", isHidden: false }, 
          { title: "拼购-参与统计", path: "/group-purchase-statistics", isHidden: false },
          { title: "拼购-轮次明细", path: "/group-purchase-rotation-detail", isHidden: false }, 
          { title: "拼购-成功用户统计", path: "/group-purchase-rotation", isHidden: false }, 
        ]
      }
    ]
  },

  {
    index: "",
    title: "九宫格管理",
    groups: [
      {
        title: "",
        list: [
          { title: "九宫格配置", path: "/squared-up-config", isHidden: false },
          { title: "九宫格轮播图", path: "/squared-up-banner", isHidden: false },
          { title: "九宫格-参与记录", path: "/squared-up-record", isHidden: false },
          { title: "九宫格-中奖信息统计", path: "/squared-up-rotation", isHidden: false },
          { title: "九宫格-数据统计", path: "/squared-up-user-statistics", isHidden: false },
        ]
      }
    ]
  },

  {
    index: 4,
    title: "系统管理",
    groups: [
      {
        title: "",
        list: [
          { title: "广告配置", path: "/advertising-config", isHidden: false },
          { title: "push配置", path: "/push", isHidden: false },
          { title: "公告配置", path: "/notice", isHidden: false }, 
          { title: "导航配置", path: "/navigation", isHidden: false },
          //  { title: "系统用户", path: "/system-user", isHidden: false },
          //  { title:"系统权限", path:"/system-permission", isHidden:false  },
        ]
      }
    ]
  },

  {
    index: 5,
    title: "商城管理",
    groups: [
      { 
        title: "", 
        list: [
          { title: "商城游戏配置", path: "/config-game", isHidden: false }, 
          { title: "商品列表", path: "/commodity-list", isHidden: false },
          { title: "商城订单", path: "/order-list", isHidden: false }, 
        ]
      }
    ]
  },

  {
    index: 6,
    title: "用户管理",
    groups: [
      {
        title: "",
        list: [
          { title: "用户列表", path: "/user-list", isHidden: false }, 
          { title: "用户验证", path: "/user-check", isHidden: false }, 
          { title: "用户反馈", path: "/user-feedback", isHidden: false }, 
          { title: "每日任务", path: "/daily-tasks", isHidden: false }, 
          { title: "基础数据统计", path: "/basic-data", isHidden: false }, 
          { title: "猫币收支记录", path: "/account-details", isHidden: false },
          { title: "猫币充值记录", path: "/recharge-statistic", isHidden: false }, 
        ]
      }
    ]
  },

  {
    index: 7,
    title: "淘手游管理",
    groups: [
      {
        title: "",
        list: [
          { title: "淘手游商品列表", path: "/tsy-goods-list", isHidden: false },
          { title: "淘手游订单列表", path: "/tsy-order-statistics", isHidden: false },
        ]
      }
    ]
  },

]


export default menuConfig
