import { Router } from "vue-router";

export let routerInstance: Router

export function setInstanceRouter(instance: Router) {
    routerInstance = instance;
}