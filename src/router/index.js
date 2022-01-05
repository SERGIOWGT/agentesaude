import Vue from 'vue'
import Router from 'vue-router'
import homeView from '../views/HomeView.vue'
import visitaView from '../views/VisitaView.vue'
import uploadView from '../views/UploadView.vue'

Vue.use(Router)

const routes = [
    {
        path: '/home',
        name: 'homeView',
        component: homeView
    },
    {
        path: '/visita',
        name: 'visitaView',
        component: visitaView
    },
    {
        path: '/upload',
        name: 'uploadView',
        component: uploadView
    }
]
const RotasApp = new Router({routes})
RotasApp.beforeEach((to, from, next) => {
    if (to.path =='/') 
        next('/home') ;
    else if ((from.path =='/') && (to.path =='/home')) 
        next();
    else if ((from.path =='/home') && (to.path !='/home'))
        next();
    else if ((from.path =='/') && ((to.path =='/visita') ||  (to.path =='/upload')))
        next('/home') ;
    else if ((from.path =='/visita') || (from.path =='/upload'))
        next();
})

export default RotasApp