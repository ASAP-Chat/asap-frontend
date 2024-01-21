export const oauthInstagram = () => {
  const appId = '1232305677642740'

  let redirect_uri
  if (process.env.NODE_ENV === 'development') {
    redirect_uri = 'http://localhost:4000/ssa3/setting/chat-integration/'
  } else {
    redirect_uri = 'https://capstone23.sit.kmutt.ac.th/ssa3/setting/chat-integration/'
  }
  const scope = 'instagram_manage_messages,pages_manage_metadata,instagram_basic'
  const url = `https://www.facebook.com/dialog/oauth?client_id=${appId}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=integrate-instagram`
  return url
}
