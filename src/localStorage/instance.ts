import { Router } from "vue-router";

let routerInstance: Router | undefined

function initRouterInstance(router: Router) {
    routerInstance = router
}

export {
    routerInstance,
    initRouterInstance
}

