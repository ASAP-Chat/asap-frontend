export const useSignOut = () => {
  const { push } = useRouter()
  const accessToken = useCookie('accessToken')
  const user = useCookie('user')
  const refreshToken = useCookie('refreshToken')
  const storeSelectCus = useCookie('storeSelectCus')
  accessToken.value = null
  user.value = null
  refreshToken.value = null
  storeSelectCus.value = null
  push('/login')
}
