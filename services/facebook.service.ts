import { SocialType } from '~/constants/SocialType'
import { ACCESS_TOKEN, USER } from '~/constants/Cookie'
import { getSocialAccount } from '~/services/message.service'

export const oauthFacebook = () => {
  const appId = '1232305677642740'

  let redirect_uri
  if (process.env.NODE_ENV === 'development') {
    redirect_uri = 'http://localhost:4000/ssa3/setting/chat-integration/'
  } else {
    redirect_uri = 'https://capstone23.sit.kmutt.ac.th/ssa3/setting/chat-integration/'
  }
  const scope = 'pages_manage_metadata,pages_read_engagement,pages_messaging'
  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirect_uri}&scope=${scope}&state=integrate-facebook&response_type=code`
  return url
}

export const createFacebook = async (code: string) => {
  const user: any = useCookie(USER)
  const access_token = useCookie(ACCESS_TOKEN)

  const { shop, _id } = user.value || {}
  const { name } = shop

  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/social-account`, {
      method: 'post',
      body: JSON.stringify({
        shopName: name,
        socialData: {
          code: code,
        },
        socialType: SocialType.FACEBOOK,
        ownerId: _id,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status.value === 'success') {
      getSocialAccount()
      return response.data.value
    } else {
      await useRefreshToken()
      console.log(`Request failed with status: ${response.error.value}`)
    }
  } catch (error) {
    console.error(error)
  }
}
