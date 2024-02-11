import { Role } from '~/constants/Role'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '~/constants/Token'

export default defineNuxtRouteMiddleware((to, from) => {
  const user: any = useCookie(USER)
  const access_token = useCookie(ACCESS_TOKEN)
  const refresh_token = useCookie(REFRESH_TOKEN)
  const role = user?.value?.role

  const allowedRoutes = ['/login/', '/signup/', '/', '/invite/']
  const chatRedirectRoutes = '/chat/'
  const profileRedirectRoute = '/setting/profile/'
  const settingRoute = ['/setting/chat-integration/', '/setting/member/']

  // Check if user is not authenticated
  if (!access_token.value || !refresh_token.value) {
    // Redirect to login if not on an allowed route
    if (!allowedRoutes.includes(to.path)) {
      return navigateTo('/login/')
    }
  } else {
    // If user is authenticated, redirect to appropriate routes
    if (allowedRoutes.includes(to.path)) {
      return navigateTo(chatRedirectRoutes)
    }

    // Redirect non-owners trying to access chat integration to profile
    if (user.value && role === Role.AGENT && settingRoute.includes(to.path)) {
      return navigateTo(profileRedirectRoute)
    }
  }
})
