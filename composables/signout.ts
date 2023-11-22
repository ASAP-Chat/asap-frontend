export const useSignOut = () => {
  const { push } = useRouter()
  const accessToken = useCookie('accessToken')
  const user = useCookie('user')
  const refreshToken = useCookie('refreshToken')
  accessToken.value = null
  user.value = null
  refreshToken.value = null
  push('/login')
}
