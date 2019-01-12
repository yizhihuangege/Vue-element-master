// login
const login = resolve=>require(['../page/Main/login.vue'],resolve);

// errorRoutes
const notFound = resolve=>require(['@/page/Main/notFound.vue'],resolve);

// 游戏管理
const gameHero = resolve=>require(['@/page/GameMgr/gameHero/gameHero'],resolve);
const gameSkin = resolve=>require(['@/page/GameMgr/gameSkin/gameSkin'],resolve);
const gameManagement = resolve=>require(['@/page/GameMgr/gameManagement/gameManagement'],resolve);
const welfare = resolve=>require(['@/page/GameMgr/welfare/welfare'],resolve);

// 转盘管理
// const turntableConfig = resolve=>require(['@/page/TurntableMgr/turntableConfig/turntableConfig'],resolve);
// const turntableRecord = resolve=>require(['@/page/TurntableMgr/turntableRecord/turntableRecord'],resolve);
// const turntableStatistics = resolve=>require(['@/page/TurntableMgr/turntableStatistics/turntableStatistics'],resolve);
// const gameStatistics = resolve=>require(['@/page/TurntableMgr/gameStatistics/gameStatistics'],resolve);

// 拼购管理
const groupPurchase = resolve=>require(['@/page/ActivityMgr/groupPurchase/groupPurchase'],resolve);
const groupPurchaseStatistics = resolve=>require(['@/page/ActivityMgr/groupPurchaseStatistics/groupPurchaseStatistics'],resolve);
const groupPurchaseRotationDetail = resolve=>require(['@/page/ActivityMgr/groupPurchaseRotationDetail/groupPurchaseRotationDetail'],resolve);  //groupPurchaseRotation
const groupPurchaseRotation = resolve=>require(['@/page/ActivityMgr/groupPurchaseRotation/groupPurchaseRotation'],resolve);

// 九宫格管理
const squaredUpConfig = resolve=>require(['@/page/SquaredUpMgr/squaredUpConfig/squaredUpConfig'],resolve);
const squaredUpRecord = resolve=>require(['@/page/SquaredUpMgr/squaredUpRecord/squaredUpRecord'],resolve);
const squaredUpBanner = resolve=>require(['@/page/SquaredUpMgr/squaredUpBanner/squaredUpBanner'],resolve);
const squaredUpRotation = resolve=>require(['@/page/SquaredUpMgr/squaredUpRotation/squaredUpRotation'],resolve);
const squaredUpUserStatistics = resolve=>require(['@/page/SquaredUpMgr/squaredUpUserStatistics/squaredUpUserStatistics'],resolve);

// 比赛管理
const gameConfig = resolve=>require(['@/page/MatchMgr/gameConfig/gameConfig'],resolve);
const groupList = resolve=>require(['@/page/MatchMgr/groupList/groupList'],resolve);
const matchRecord = resolve=>require(['@/page/MatchMgr/matchRecord/matchRecord'],resolve);
const guessingItem = resolve=>require(['@/page/MatchMgr/guessingItem/guessingItem'],resolve);
const settlement = resolve=>require(['@/page/MatchMgr/settlement/settlement'],resolve);
const settlementOrder = resolve=>require(['@/page/MatchMgr/settlementOrder/settlementOrder'],resolve);
const betStatistics = resolve=>require(['@/page/MatchMgr/betStatistics/betStatistics'],resolve);
const goldCoin = resolve=>require(['@/page/MatchMgr/goldCoin/goldCoin'],resolve);

// 系统管理
const systemUser = resolve=>require(['@/page/SystemMgr/systemUser/systemUser'],resolve);
const systemPermission = resolve=>require(['@/page/SystemMgr/systemPermission/systemPermission'],resolve);
const advertisingConfig = resolve=>require(['@/page/SystemMgr/advertisingConfig/advertisingConfig'],resolve);
const push = resolve=>require(['@/page/SystemMgr/push/push'],resolve);
const notice = resolve=>require(['@/page/SystemMgr/notice/notice'],resolve);
const navigation = resolve=>require(['@/page/SystemMgr/navigation/navigation'],resolve);

// 商城管理
const configGame = resolve=>require(['@/page/CommodityMgr/configGame/configGame'],resolve);
const commodityList = resolve=>require(['@/page/CommodityMgr/commodityList/commodityList.vue'],resolve);
const orderList = resolve=>require(['@/page/CommodityMgr/orderList/orderList'],resolve);

// 用户管理
const userList = resolve=>require(['@/page/userMgr/userList/userList'],resolve);
const userFeedback = resolve=>require(['@/page/userMgr/userFeedback/userFeedback'],resolve);
const dailyTasks = resolve=>require(['@/page/userMgr/dailyTasks/dailyTasks'],resolve);
const userCheck = resolve=>require(['@/page/userMgr/userCheck/userCheck'],resolve);
const basicData = resolve=>require(['@/page/userMgr/basicData/basicData'],resolve);
const rechargeStatistics = resolve=>require(['@/page/userMgr/rechargeStatistics/RechargeStatistics'],resolve);
const accountDetails = resolve=>require(['@/page/userMgr/accountDetails/accountDetails'],resolve);

// 淘手游管理
const tsyOrderStatistics = resolve=>require(['@/page/TsyMgr/tsyOrderStatistics/tsyOrderStatistics'],resolve);
const tsyGoodsList = resolve=>require(['@/page/TsyMgr/tsyGoodsList/tsyGoodsList'],resolve);


const allRoutes=[

/** 游戏管理 */
    // 王者荣耀-英雄
    { path:'/game-hero', name:'gameHero', component:gameHero },
    // 王者荣耀-皮肤
    { path:'/game-skin', name:'gameSkin', component:gameSkin },
    // 小游戏管理
    { path:'/game-management', name:'gameManagement', component:gameManagement },
    // 福利码管理
    { path:'/welfare', name:'welfare', component:welfare },

/** 转盘管理 */
    // 转盘配置
    // { path: '/turntable-config', name: 'turntableConfig', component: turntableConfig },
    // 转盘参与记录
    // { path:'/turntable-record', name:'turntableRecord', component:turntableRecord },
    // 转盘数据统计
    // { path:'/turntable-statistics', name:'turntableStatistics', component:turntableStatistics },
    // 小游戏数据统计
    // { path:'/game-statistics', name:'gameStatistics', component:gameStatistics },

/** 拼购管理 */
    // 拼购配置
    { path:'/group-purchase', name:'groupPurchase', component:groupPurchase },
    // 拼购-参与统计
    { path:'/group-purchase-statistics', name:'groupPurchaseStatistics', component:groupPurchaseStatistics },
    // 拼购-轮次明细
    { path:'/group-purchase-rotation-detail', name:'groupPurchaseRotationDetail', component:groupPurchaseRotationDetail },
    // 拼购-成功用户统计
    { path:'/group-purchase-rotation', name:'groupPurchaseRotation', component:groupPurchaseRotation },
    


/** 九宫格管理 */
    // 九宫格配置
    { path: '/squared-up-config', name: 'squaredUpConfig', component: squaredUpConfig },
    // 九宫格参与记录
    { path: '/squared-up-record', name: 'squaredUpRecord', component: squaredUpRecord },
    // 九宫格banner
    { path: '/squared-up-banner', name: 'squaredUpBanner', component: squaredUpBanner },
    // 九宫格-轮次统计
    
    { path: '/squared-up-rotation', name: 'squaredUpRotation', component: squaredUpRotation },
    // 九宫格用户列表
    { path: '/squared-up-user-statistics', name: 'squaredUpUserStatistics', component: squaredUpUserStatistics },

/** 比赛管理 */
    // 游戏配置
    { path: '/game-config', name: 'gameConfig', component: gameConfig },
    // > 队伍配置
    { path: '/group-list', name: 'groupList', component: groupList },
    // 比赛列表
    { path:'/match-record', name:'matchRecord', component:matchRecord },
        //  >竞猜项
    { path:'/guessing-item', name:'guessingItem', component:guessingItem },
            //  >玩家结算
    { path:'/settlement', name:'settlement', component:settlement },
    // 结算订单
    { path:'/settlement-order', name:'settlementOrder', component:settlementOrder },
    // 下注收益统计
    { path:'/bet-statistics', name:'betStatistics', component:betStatistics },
    // 非正即反收益统计
    { path:'/gold-coin', name:'goldCoin', component:goldCoin },

/** 系统管理 */
    // 广告配置
    { path: '/advertising-config', name: 'advertisingConfig', component: advertisingConfig },
    // push配置
    { path:'/push', name:'push', component:push },
    // 公告配置
    { path:'/notice', name:'notice', component:notice },
    // 导航配置
    { path: '/navigation', name: 'navigation', component: navigation },
    // 系统用户
    { path:'/system-user', name:'systemUser', component:systemUser },
    // 系统权限
    { path:'/system-permission', name:'systemPermission', component:systemPermission },

/** 商城管理 */
    // 商城游戏配置
    { path: '/config-game', name: 'configGame', component: configGame }, 
    // 商品列表
    { path: '/commodity-list', name: 'commodityList', component: commodityList },
    // 商城订单
    { path:'/order-list', name:'orderList', component:orderList },

/** 用户管理 */
    // 用户列表
    { path: '/user-list', name: 'userList', component: userList }, 
    // 用户反馈
    { path: '/user-feedback', name: 'userFeedback', component: userFeedback }, 
    // 每日任务
    { path: '/daily-tasks', name: 'dailyTasks', component: dailyTasks },
    // 用户验证
    { path:'/user-check', name:'userCheck', component:userCheck },
    // 猫币充值记录
    { path: '/recharge-statistic', name: 'rechargeStatistics', component: rechargeStatistics }, 
    // 猫币收支记录
    { path:'/account-details', name:'accountDetails', component:accountDetails },
    // 基础数据统计
    { path:'/basic-data', name:'basicData', component:basicData },

/** 淘手游管理 */
    // 淘手游订单列表
    { path: '/tsy-order-statistics', name: 'tsyOrderStatistics', component: tsyOrderStatistics },
    { path: '/tsy-goods-list', name: 'tsyGoodsList', component: tsyGoodsList }, 

];

const loginRoutes = [
    { path: '/', redirect: '/login' }, 
    { path: '/login', name: 'Login', component: login, meta: { requiresAuth: false } },
];

const errorRoutes = [
    { path: '/404', name: '404', component: notFound, meta: { requiresAuth: true } }, 
    { path: '/*', name: 'any', redirect: '404' },
];
export { allRoutes,loginRoutes,errorRoutes } 