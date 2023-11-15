import { SocialType } from '~/composables/socialType'
export interface CreateLineInfo {
  shopName: string
  socialData: {
    channelSecret: string
    channelAccessToken: string
  }
  socialType: SocialType.LINE
  ownerId: string
}
