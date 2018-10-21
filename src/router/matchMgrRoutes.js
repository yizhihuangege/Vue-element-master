
import matchRecord from '@/page/MatchMgr/matchRecord/matchRecord.vue';
import guessingItem from '@/page/MatchMgr/guessingItem/guessingItem.vue';
import settlement from '@/page/MatchMgr/settlement/settlement.vue';

const matchMgrRoutes=[
    {
        path:'/match-record',
        name:'matchRecord',
        component:matchRecord
    },{
        path:'/guessing-item',
        name:'guessingItem',
        component:guessingItem
    },{
        path:'/settlement',
        name:'settlement',
        component:settlement
    }
]

export default matchMgrRoutes;
