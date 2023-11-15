export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const accessToken = localStorage.getItem('accessToken')

    const userInfoString = localStorage.getItem('user')
    const userInfo = userInfoString && JSON.parse(userInfoString)

    let defaultRoute = ['/login', '/signup']
    let settingChatIntegration = ['/setting/chat-integration']
    if (!accessToken) {
      if (!defaultRoute.includes(to.path)) {
        return navigateTo('/login')
      }
    } else if (defaultRoute.includes(to.path)) {
      return navigateTo('/chat')
    }

    if (userInfo && !userInfo.isOwner) {
      if (settingChatIntegration.includes(to.path)) {
        return navigateTo('/setting/profile')
      }
    }
  }
})
