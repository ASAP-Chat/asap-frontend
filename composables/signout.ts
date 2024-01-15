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
const resetCookie = (cookieName: string) => {
  const cookie = useCookie(cookieName)
  cookie.value = null
}
export const useSignOut = () => {
  resetCookie('accessToken')
  resetCookie('user')
  resetCookie('refreshToken')
  resetCookie('storeSelectCus')
  socket.emit('leave-message', name)
  navigateTo('/')
}
