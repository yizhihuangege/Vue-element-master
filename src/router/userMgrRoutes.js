import userList from '../page/userMgr/userList/userList';
import userFeedback from '../page/userMgr/userFeedback/userFeedback'
import dailyTasks from '../page/userMgr/dailyTasks/dailyTasks'
import userCheck from '../page/userMgr/userCheck/userCheck'

const userListRoutes = [{
  path: '/user-list',
  name: 'userList',
  component: userList
}, {
  path: '/user-feedback',
  name: 'userFeedback',
  component: userFeedback
}, {
  path: '/daily-tasks',
  name: 'dailyTasks',
  component: dailyTasks
},{
  path:'/user-check',
  name:'userCheck',
  component:userCheck
}]

export default userListRoutes;
