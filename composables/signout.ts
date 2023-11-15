export const useSignOut = () => {
  const router = useRouter()
  if (process.client) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
  router.push('/login')
}
