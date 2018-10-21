import gameList from "@/page/GameMgr/gameList/gameList.vue";
import groupList from "@/page/GameMgr/groupList/groupList.vue";
import turntableConfig from '@/page/GameMgr/turntableConfig/turntableConfig.vue'
import participationRecord from '@/page/GameMgr/participationRecord/participationRecord'
import configGame from '../page/GameMgr/configGame/configGame'

const gameMgrRoutes = [{
    path: '/game-list',
    name: 'gameList',
    component: gameList
  }, {
    path: '/group-list',
    name: 'groupList',
    component: groupList
  }, {
    path: '/turntable-config',
    name: 'turntableConfig',
    component: turntableConfig
  },
  {
    path: '/config-game',
    name: 'configGame',
    component: configGame
  },
  {
    path: '/participation-record',
    name: 'participationRecord',
    component: participationRecord
  }
]

export default gameMgrRoutes;
