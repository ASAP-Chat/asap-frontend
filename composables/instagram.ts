import { ACCESS_TOKEN, USER } from '~/constants/Token'
import { SocialType } from '~/constants/SocialType'
import { getSocialAccount } from '~/services/message.service'

export const oauthInstagram = () => {
  const appId = '1232305677642740'

  let redirect_uri
  if (process.env.NODE_ENV === 'development') {
    redirect_uri = 'http://localhost:4000/ssa3/setting/chat-integration/'
  } else {
    redirect_uri = 'https://capstone23.sit.kmutt.ac.th/ssa3/setting/chat-integration/'
  }
  const scope = 'instagram_manage_messages,pages_manage_metadata,instagram_basic'
  const url = `https://www.facebook.com/dialog/oauth?client_id=${appId}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${redirect_uri}&response_type=token&scope=${scope}&state=integrate-instagram`
  return url
}

// https://www.facebook.com/dialog/oauth?client_id=1232305677642740&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=https://capstone23.sit.kmutt.ac.th/ssa3/setting/chat-integration/&response_type=token&scope=instagram_manage_messages,pages_manage_metadata,instagram_basic&state=integrate-instagram

export const createInstagram = async (token: string) => {
  const user: any = useCookie(USER)
  const access_token = useCookie(ACCESS_TOKEN)

  const { shop, _id } = user.value && user.value
  const { name } = shop

  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/social-account`, {
      method: 'post',
      body: JSON.stringify({
        shopName: name,
        socialData: {
          access_token: token,
        },
        socialType: SocialType.INSTAGRAM,
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
