import { Manager } from 'socket.io-client'

// const manager = new Manager('https://' + import.meta.env.VITE_SOCKET_URL, {
//   path: '/ssa3/ws/',
// })
// const socket = manager.socket('/latest-message')
// const manager = new Manager(import.meta.env.VITE_SOCKET_URL, {
//   // path: '/ssa3/sockets/ws/',
//   path: '/ws/',
// })
// const socket = manager.socket('/sockets/latest-message')

export const useSignOut = () => {
  const accessToken = useCookie('accessToken')
  const user = useCookie('user')
  const refreshToken = useCookie('refreshToken')
  const storeSelectCus = useCookie('storeSelectCus')
  // socket.emit('leave-message')
  accessToken.value = null
  user.value = null
  refreshToken.value = null
  storeSelectCus.value = null
  navigateTo('/login/')
}
