import notFound from '../page/Main/notFound.vue';


const errorRoutes = [
  {
    path: '/404',
    name: '404',
    component: notFound,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/*',
    name: 'any',
    redirect: '404'
  }
]

export default errorRoutes;
