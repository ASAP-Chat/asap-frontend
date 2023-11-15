export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const accessToken = localStorage.getItem('accessToken')

    const userInfoString = localStorage.getItem('user')
    const userInfo = userInfoString && JSON.parse(userInfoString)

    const indexRoute = '/'
    const allowedRoutes = ['/login', '/signup']
    const chatRedirectRoutes = ['/chat']
    const profileRedirectRoute = '/setting/profile'
    const chatIntegrationRoute = '/setting/chat-integration'

    if (indexRoute.includes(to.path)) {
      return navigateTo('/login')
    }

    if (!accessToken) {
      if (!allowedRoutes.includes(to.path)) {
        return navigateTo('/login')
      }
    } else if (allowedRoutes.includes(to.path)) {
      return navigateTo(chatRedirectRoutes.includes(to.path) ? '/chat' : '/login')
    }

    if (userInfo && !userInfo.isOwner && to.path === chatIntegrationRoute) {
      return navigateTo(profileRedirectRoute)
    }
  }
})
