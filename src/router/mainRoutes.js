import notFound from '../page/Main/notFound.vue';
import login from '../page/Main/login.vue';

const MainRoutes = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        name: 'Login',
        component: login,
        meta: {
            requiresAuth: false
        }
    }
]

export default MainRoutes;
