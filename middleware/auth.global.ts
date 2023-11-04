export default defineNuxtRouteMiddleware((to, from) => {
  const accessToken = localStorage.getItem('accessToken')

  let defaultRoute = ['/login', '/signup']
  if (!accessToken) {
    if (!defaultRoute.includes(to.path)) {
      return navigateTo('/login')
    }
  } else {
    if (to.path === '/login' || to.path === '/signup') {
      return navigateTo('/chat')
    }
  }
})
