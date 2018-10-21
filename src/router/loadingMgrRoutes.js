import loading from '../page/LoadingMgr/loading/loading'
import banner from '../page/LoadingMgr/banner/banner'
import advertising from '../page/LoadingMgr/advertising/advertising'
import push from '../page/LoadingMgr/push/push'

const loadingMgrRoutes = [
  {
    path: '/loading',
    name: 'loading',
    component: loading
  },{
    path:'/banner',
    name:'banner',
    component:banner
  },
  {
    path:'/advertising',
    name:'advertising',
    component:advertising
  },{
    path:'/push',
    name:'push',
    component:push
  }
]

export default loadingMgrRoutes
