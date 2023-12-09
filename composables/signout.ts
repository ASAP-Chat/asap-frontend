import { Manager } from 'socket.io-client'

const manager = new Manager(import.meta.env.VITE_SOCKET_URL)
const socket = manager.socket('/socketio/latest-message')

export const useSignOut = () => {
  const accessToken = useCookie('accessToken')
  const user = useCookie('user')
  const refreshToken = useCookie('refreshToken')
  const storeSelectCus = useCookie('storeSelectCus')
  socket.emit('leave-message ')
  accessToken.value = null
  user.value = null
  refreshToken.value = null
  storeSelectCus.value = null
  navigateTo('/login/')
}
