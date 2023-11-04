export const useSignOut = () => {
  const router = useRouter()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  router.push('/login')
}
