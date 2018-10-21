import orderList from "@/page/orderMgr/orderList/orderList";
import exchangeOrder from "@/page/orderMgr/exchangeOrder/exchangeOrder"

import settlementOrder from "@/page/orderMgr/settlementOrder/settlementOrder"
// import settlementOrder from "@/page/orderMgr/settlementOrder/settlementOrder"

const orderMgrRoutes = [
  {
    path:'/order-list',
    name:'orderList',
    component:orderList
  },{
    path:'/exchange-order',
    name:'exchangeOrder',
    component:exchangeOrder
  },{
    path:'/settlement-order',
    name:'settlementOrder',
    component:settlementOrder
  }
]

export default orderMgrRoutes;
