import Vue from 'vue'
import Router from 'vue-router'
import proxyNetwork from '../components/network.vue'
import proxyRule from '../components/rule.vue'
import proxyMock from '../components/mock.vue'
import proxyRequest from '../components/request.vue'

Vue.use(Router);

const routes = [
    {path: '/', component: proxyNetwork},
    {path: '/network', component: proxyNetwork},
    {path: '/rule', component: proxyRule},
    {path: '/mock', component: proxyMock},
    {path: '/request', component: proxyRequest,name:"request"}
];

export default new Router({
    routes
});