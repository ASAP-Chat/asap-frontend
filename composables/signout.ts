import { Manager } from 'socket.io-client'

let socketURL
if (process.env.NODE_ENV === 'development') {
  socketURL = import.meta.env.VITE_SOCKET_URL
} else {
  socketURL = 'wss://' + import.meta.env.VITE_SOCKET_URL
}

const manager = new Manager(socketURL, {
  path: '/ssa3-socket',
  forceNew: true,
})
const socket = manager.socket('/sockets/latest-message')
const { user } = useGetCookie()
const { shop } = user && user
const { name } = shop

export const useSignOut = () => {
  const accessToken = useCookie('accessToken')
  const user = useCookie('user')
  const refreshToken = useCookie('refreshToken')
  const storeSelectCus = useCookie('storeSelectCus')
  socket.emit('leave-message', name)
  accessToken.value = null
  user.value = null
  refreshToken.value = null
  storeSelectCus.value = null
  navigateTo('/login/')
}
