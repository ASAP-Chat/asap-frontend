export default defineNuxtRouteMiddleware((to, from) => {
  const { accessToken, user } = useGetCookie()

  const isOwner = user?.isOwner

  const allowedRoutes = ['/login', '/signup']
  const chatRedirectRoutes = ['/chat']
  const profileRedirectRoute = '/setting/profile'
  const chatIntegrationRoute = '/setting/chat-integration'

  // Check if user is not authenticated
  if (!accessToken) {
    // Redirect to login if not on an allowed route
    if (!allowedRoutes.includes(to.path)) {
      return navigateTo('/login')
    }
  } else {
    // If user is authenticated, redirect to appropriate routes
    if (allowedRoutes.includes(to.path)) {
      return navigateTo(chatRedirectRoutes.includes(to.path) ? '/chat' : '/')
    }

    // Redirect non-owners trying to access chat integration to profile
    if (user && !isOwner && to.path === chatIntegrationRoute) {
      return navigateTo(profileRedirectRoute)
    }
  }
})
