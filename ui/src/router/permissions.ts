import SessionService from "@/services/cache/session-state";
import router from "@/router/index";

router.beforeEach((to, from, next) => {
    console.log('router');
    const isValid = SessionService.isSetupValid();

    // Check if the route requires setup and if the API token is not set
    if (to.path == '/documentation'){
        location.href = 'https://wiki-iframe.private.infigosoftware.rocks/api-reference.html';
        return;
    }
    if (to.path !== "/setup" && !isValid) {
        next("/setup"); // Redirect to setup page if API token is missing
    } else {
        if (to.path == '/') {
            next('/product');
        } else {
            next(); // Proceed to the requested route
        }
    }
});
