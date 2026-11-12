export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const user = localStorage.getItem('google_user')
    
    // If user is not logged in and trying to access anything other than /login
    if (!user && to.path !== '/login') {
      return navigateTo('/login')
    }
    
    // If user is logged in and trying to go to /login, redirect to dashboard
    if (user && to.path === '/login') {
      return navigateTo('/')
    }
  }
})