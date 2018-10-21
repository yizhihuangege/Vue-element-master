import router from '@/router/index.js';
import errorRoutes from '@/router/errorRoutes.js';
import gameMgrRoutes from '@/router/gameMgrRoutes.js';
import matchMgrRoutes from '@/router/matchMgrRoutes.js';
import commodityListRoutes from '@/router/commodityListRoutes.js';
import orderMgrRoutes from '@/router/orderMgr.js';
import userMgrRoutes from '@/router/userMgrRoutes.js';
import RechargeMgrRoutes from '@/router/rechargeMgrRoutes.js';
import loadingMgrRoutes from '@/router/loadingMgrRoutes.js'
import noticeMgrRoutes from '@/router/noticeMgrRoutes.js'
import navigationMgrRoutes from '@/router/navigationMgrRoutes'

import {setAuth} from "./setAuth.js";
import bus from '@/plugin/box_bus';

const setRoutes=()=>{
  let user = localStorage.getItem('userName');
  let path="/";
  let curRouter;
  
  curRouter=[
    ...gameMgrRoutes,             //游戏管理,
    ...matchMgrRoutes,            //比赛管理
    ...loadingMgrRoutes,          //广告管理
    ...noticeMgrRoutes,           //公告管理
    ...navigationMgrRoutes,       //导航管理
    ...commodityListRoutes,       //商品管理
    ...userMgrRoutes,             //用户管理
    ...RechargeMgrRoutes,         // 充值统计
    ...orderMgrRoutes,            //订单管理
  ]
  curRouter = setAuth(curRouter);
  //设置默认页
  path='game-list'

  let error = setAuth(errorRoutes);

  router.addRoutes(curRouter);
  router.addRoutes(error);

  
  setTimeout(()=>{
    bus.$emit("updateLoadingText", "页面载入完毕");
  },200)
  setTimeout(()=>{
    bus.$emit("unLoadAnime");
  },1000)

  return path;
}
export {setRoutes};

