import Vue from 'vue'

/**
 * @file 左侧菜单栏的配置，被menu.vue读取
 */

const menuConfig = {
  menu: [

    {
      index: 0,
      title: "游戏管理",
      groups: [{
        title: '',
        list: [{
          title: '游戏配置',
          path: '/game-list',
          isHidden: false
        }, {
          title: '转盘配置',
          path: '/turntable-config',
          isHidden: false
        }, {
          title: '商城游戏配置',
          path: '/config-game',
          isHidden: false
        }, {
          title: "转盘参与记录",
          path: "/participation-record",
          isHidden: false
        }]
      }]
    },
    {
      index: 1,
      title: "比赛管理",
      groups: [{
        title: '',
        list: [{
          title: '比赛列表',
          path: '/match-record',
          isHidden: false
        }, ]
      }]
    },
    {
      index: 0,
      title: "广告管理",
      groups: [{
        title: '',
        list: [{
          title: '启动页配置',
          path: '/loading',
          isHidden: false
        }, {
          title: '幻灯片配置',
          path: '/banner',
          isHidden: false
        },{
          title:'弹窗广告配置',
          path:'/advertising',
          isHidden:false
        },{
          title:'push配置',
          path:'/push',
          isHidden:false
        }]
      }]
    },
    {
      index: 1,
      title: "公告管理",
      groups: [{
        title: '',
        list: [{
          title: '公告配置',
          path: '/notice',
          isHidden: false
        }, ]
      }]
    },
    {
      index: 6,
      title: '导航管理',
      groups: [{
        title: '',
        list: [{
          title: '导航配置',
          path: '/navigation',
          isHidden: false
        }]
      }]
    },
    {
      index: 2,
      title: '商品管理',
      groups: [{
        title: '',
        list: [{
          title: '商品列表',
          path: '/commodity-list',
          isHidden: false
        }]
      }]
    },
    {
      index: 4,
      title: '用户管理',
      groups: [{
        title: '',
        list: [{
          title: '用户列表',
          path: '/user-list',
          isHidden: false
        }, {
          title: "用户验证",
          path: "/user-check",
          isHidden: false
        }, {
          title: '用户反馈',
          path: '/user-feedback',
          isHidden: false
        }, {
          title: '每日任务',
          path: '/daily-tasks',
          isHidden: false
        }]
      }]
    },

    {
      index: 6,
      title: '充值统计',
      groups: [{
        title: '',
        list: [{
          title: '充值记录',
          path: '/recharge-statistic',
          isHidden: false
        }, {
          title: "移动积分兑换记录",
          path: "/integral-record",
          isHidden: false
        }]
      }]
    },

    {
      index: 5,
      title: '订单管理',
      groups: [{
        title: '',
        list: [{
          title: '订单列表',
          path: '/order-list',
          isHidden: false
        }, {
          title: '兑换订单',
          path: '/exchange-order',
          isHidden: false
        }, {
          title: '结算订单',
          path: '/settlement-order',
          isHidden: false
        }]
      }]
    },

  ]
}

export default menuConfig;
