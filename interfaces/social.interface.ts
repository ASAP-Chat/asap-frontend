export enum SocialType {
  LINE = 'LINE',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
}
export interface SocialLinks {
  facebook: string
  instagram: string
  line: string
}
export interface CreateLineInfo {
  shopName: string
  socialData: {
    channelSecret: string
    channelAccessToken: string
  }
  socialType: SocialType.LINE
  ownerId: string
}

export interface ChatTemplateInfo {
  keyword: string
  template: string
}

export interface MemberInfo {
  email: string
  role: string
  shop: object
}

export interface ChatbotInfo {
  keyword: string[]
  replyMessage: string
}
