<template>
  <div class="container tw-flex tw-items-center tw-font-[Anuphan]">
    <div class="tw-chat-image tw-avatar">
      <div class="tw-w-10 tw-rounded-full">
        <img
          :src="props.img ? props.img : profileSrc"
          alt="profile"
        />
      </div>
    </div>

    <div class="ms-2">
      <p class="font-weight-bold">คุณมีข้อความใหม่ !</p>
      <p>{{ generateNotiSubtext() }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MsgType } from '~/constants/MessageType'
import profileSrc from '~/assets/images/profile.png'

const props = defineProps<{
  img?: string
  msg?: string
  type: string
  senderName?: string
}>()

const generateNotiSubtext = () => {
  switch (props.type) {
    case MsgType.TEXT:
      return props.msg
    case MsgType.STICKER:
      return `${props.senderName} ส่งสติกเกอร์`
    case MsgType.IMAGE:
      return `${props.senderName} ส่งรูปภาพ`
    case MsgType.VIDEO:
      return `${props.senderName} ส่งวิดิโอ`
    case MsgType.AUDIO:
      return `${props.senderName} ส่งข้อความเสียง`
    case MsgType.LOCATION:
      return `${props.senderName} ส่งตำแหน่งที่ตั้ง`
    default:
      return ''
  }
}
</script>
