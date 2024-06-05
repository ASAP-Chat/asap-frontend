import { Manager } from 'socket.io-client'
import { USER, REFRESH_TOKEN, ACCESS_TOKEN } from '~/constants/Cookie'

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
const storeCustomer = useStoreCustomer()
const user: any = useCookie(USER)

const { shop } = user?.value || {}
const { name } = shop || {}

const resetCookie = (cookieName: string) => {
  const cookie = useCookie(cookieName)
  cookie.value = null
}
export const useSignOut = () => {
  socket.emit('leave-message', name)
  resetCookie(ACCESS_TOKEN)
  resetCookie(USER)
  resetCookie(REFRESH_TOKEN)
  storeCustomer.value = null
  navigateTo('/')
}
