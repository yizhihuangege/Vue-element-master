import rechargeStatistics from '@/page/RechargeMgr/rechargeStatistics/RechargeStatistics';
import intergralRecord from '@/page/RechargeMgr/integralRecord/integralRecord'


const RechargeMgrRoutes = [{
    path: '/recharge-statistic',
    name: 'rechargeStatistics',
    component: rechargeStatistics
  }, {
    path: '/integral-record',
    name: 'intergralRecord',
    component: intergralRecord
  }

]
export default RechargeMgrRoutes;
