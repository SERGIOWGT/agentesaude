import Vue from 'vue'
import Router from 'vue-router'
import homeView from '../views/HomeView.vue'
import downloadDataView from '../views/DownloadDataView.vue'
import visitaView from '../views/VisitaView.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'homeView',
        component: homeView
    },
    {
        path: '/downloadData',
        name: 'downloadDataView',
        component: downloadDataView
    },
    {
        path: '/Visita',
        name: 'visitaView',
        component: visitaView
    }
]

const RotasApp = new Router({routes})

export default RotasApp