import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '~/constants/Token'

export default defineNuxtRouteMiddleware((to, from) => {
  const user: any = useCookie(USER)
  const access_token = useCookie(ACCESS_TOKEN)
  const refresh_token = useCookie(REFRESH_TOKEN)
  const isOwner = user?.value?.isOwner

  const allowedRoutes = ['/login/', '/signup/', '/']
  const chatRedirectRoutes = '/chat/'
  const profileRedirectRoute = '/setting/profile/'
  const chatIntegrationRoute = '/setting/chat-integration/'

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
    if (user.value && !isOwner && to.path === chatIntegrationRoute) {
      return navigateTo(profileRedirectRoute)
    }
  }
})
