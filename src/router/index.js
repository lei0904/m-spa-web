import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login.vue'
import Scheduling from '@/views/Scheduling.vue'
import Manage from '@/views/Manage.vue'
import ManageTech from '@/views/ManageTech.vue'
import ManageTechDetail from '@/views/ManageTechDetail.vue'
import RoomStatus from '@/views/RoomStatus.vue'
import TechnicianStatus from '@/views/TechnicianStatus.vue'
import DataDetail from '@/views/DataDetail.vue'
import Message from '@/views/Message.vue'
import GetTechnicians from '@/views/GetTechnician.vue'
import SetTechnician from '@/views/SetTechnician.vue'
import ChangeInfo from '@/views/ChangeInfo.vue'
import RoomInfo from '@/views/RoomInfo.vue'
import AddClockTech from '@/views/AddClockTech.vue'
import StartClockTech from '@/views/StartClockTech.vue'
import CloseClock from '@/views/CloseClock.vue'
import RetreatRoom from '@/views/RetreatRoom.vue'
import BackoutOrder from '@/views/BackoutOrder.vue'
import ChangeTechnician from '@/views/ChangeTechnician.vue'
import BuyRecord from '@/views/BuyRecord.vue'
import TechnicianDetail from '@/views/TechnicianDetail.vue'
import TechnicianIndex from '@/views/TechnicianIndex.vue'
import ChangeData from '@/views/ChangeData.vue'
import MyOrder from '@/views/MyOrder.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import UpdateService from '@/views/UpdateService.vue'
import AutoConfig from '@/views/AutoConfig.vue'


let routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      backAble: true,
      value: 1,
      backPath:'',
      techBackPath:''
    }
  },
  {
    path: '/scheduling',
    name: 'Scheduling',
    component: Scheduling,
    meta: {
      value: 2,
      backAble: true,
      name:'排班',
      backPath:'/',
      techBackPath:'/'
    }
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage,
    meta: {
      value: 3,
      backAble: true,
      name:'管理员界面',
      backPath:'/scheduling',
    }
  },
  {
    path: '/roomStatus',
    name: 'RoomStatus',
    component: RoomStatus,
    meta: {
      value: 4,
      backAble: true,
      name:'房态中心',
      backPath:'/manage',
    }
  },
  {
    path: '/manageTech',
    name: 'ManageTech',
    component: ManageTech,
    meta: {
      value: 5,
      name:'房间技师列表',
      backAble: true,
      backPath:'/roomStatus',
    }
  },

  {
    path: '/manageTechDetail',
    name: 'ManageTechDetail',
    component: ManageTechDetail,
    meta: {
      value: 6,
      backAble: true,
      name:'技师信息列表',
      backPath:'/manageTech',
    }
  },

  {
    path: '/startClockTech',
    name: 'StartClockTech',
    component: StartClockTech,
    meta: {
      value: 5,
      name:'上钟',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/changeInfo',
    name: 'ChangeInfo',
    component: ChangeInfo,
    meta: {
      value: 5,
      name:'修改',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/retreatRoom',
    name: 'RetreatRoom',
    component: RetreatRoom,
    meta: {
      value: 5,
      name:'退钟',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/addClockTech',
    name: 'AddClockTech',
    component: AddClockTech,
    meta: {
      value: 5,
      name:'加钟',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/closeClock',
    name: 'CloseClock',
    component: CloseClock,
    meta: {
      value: 5,
      name:'下钟',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/backoutOrder',
    name: 'BackoutOrder',
    component: BackoutOrder,
    meta: {
      value: 5,
      name:'撤单',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/changeTechnician',
    name: 'ChangeTechnician',
    component: ChangeTechnician,
    meta: {
      value: 5,
      name:'换技师',
      backAble: true,
      backPath:'/manageTechDetail'
    }
  },
  {
    path: '/technicianStatus',
    name: 'TechnicianStatus',
    component: TechnicianStatus,
    meta: {
      value: 4,
      backAble: true,
      name:'技师状态',
      backPath:'/manage'
    }
  },
  {
    path: '/dataDetail',
    name: 'DataDetail',
    component: DataDetail,
    meta: {
      value: 4,
      name:'数据中心',
      backAble: true,
      backPath:'/manage',
      techBackPath:'/technicianIndex',
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: Message,
    meta: {
      value: 7,
      name:'消息通知',
      backAble: true,
      backPath:'/manage'
    }
  },
  {
    path: '/getTechnicians',
    name: 'GetTechnicians',
    component: GetTechnicians,
    meta: {
      value: 3,
      backAble: true,
      name:'点钟',
      backPath:'/manageTech'

    }
  },
  {
    path: '/setTechnician',
    name: 'SetTechnician',
    component: SetTechnician,
    meta: {
      value: 3,
      backAble: true,
      name:'轮钟',
      backPath:'/manageTech'
    }
  },
  {
    path: '/roomInfo',
    name: 'RoomInfo',
    component: RoomInfo,
    meta: {
      value: 3,
      backAble: true,
      name:'房间信息',
      backPath:'/manageTech'
    }
  },
  {
    path: '/buyRecord',
    name: 'BuyRecord',
    component: BuyRecord,
    meta: {
      value: 3,
      backAble: true,
      backPath:'/manageTech',
      name:'商品服务',
      techBackPath:'/technicianIndex'
    }
  },
  {
    path: '/technicianIndex',
    name: 'TechnicianIndex',
    component: TechnicianIndex,
    meta: {
      value: 3,
      backAble: true,
      name:'技师首页',
      techBackPath:'/scheduling'
    }
  },
  {
    path: '/technicianDetail',
    name: 'TechnicianDetail',
    component: TechnicianDetail,
    meta: {
      value: 4,
      name:'详情',
      backAble: true,
      techBackPath:'/technicianIndex'
    }
  },
  {
    path: '/changeData',
    name: 'ChangeData',
    component: ChangeData,
    meta: {
      value: 4,
      backAble: true,
      backPath:'/manage',
      name:'修改资料',
      techBackPath:'/technicianIndex'
    }
  },
  {
    path: '/myOrder',
    name: 'MyOrder',
    component: MyOrder,
    meta: {
      value: 5,
      backAble: true,
      backPath:'/manage',
      name:'我的订单',
      techBackPath:'/technicianIndex'
    }
  },
  {
    path: '/changePassword',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {
      value: 6,
      backAble: true,
      name:'修改密码',
      backPath:'/changeData',
      techBackPath:'/changeData'
    }
  },
  {
    path: '/updateService',
    name: 'UpdateService',
    component: UpdateService,
    meta: {
      value: 5,
      backAble: true,
      name:'技师服务',
      techBackPath:'/technicianDetail'
    }
  },
  {
    path: '/autoConfig',
    name: 'AutoConfig',
    component: AutoConfig,
    meta: {
      value: 2,
      name:'配置修改',
      backAble: true,
      backPath:'/',
      techBackPath:'/'
    }
  },
];

Vue.use(Router);

let router = new Router({
  routes
});

export default router
