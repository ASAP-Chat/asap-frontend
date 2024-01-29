import { ACCESS_TOKEN, USER } from '~/constants/Token'

const socialInfo = ref()
const latestMessages = ref()
const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)
const { shop, isOwner, _id } = user.value && user.value
const { name } = shop

export const useGetSocialAccount = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/social-account?ownerId=${_id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status === 200) {
      socialInfo.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await useGetSocialAccount()
    }
  } catch (error: any) {
    console.log(error)
  }

  return { socialInfo }
}

export const getLatestMsg = async () => {
  if (isOwner) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/social-message/${name}/latest`,
        {
          method: 'get',
          headers: {
            Authorization: 'Bearer ' + access_token.value,
          },
        }
      )
      if (response.status === 200) {
        latestMessages.value = await response.json()
      } else if (response.status === 401) {
        console.log('call - refresh token')
        await useRefreshToken()
        await getLatestMsg()
      }
    } catch (error: any) {
      console.log(error)
    }
  }
  return { latestMessages }
}
