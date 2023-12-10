<template>
  <div class="container tw-flex tw-items-center tw-font-[Anuphan]">
    <div class="tw-chat-image tw-avatar">
      <div
        class="tw-w-10 tw-rounded-full"
        v-if="props.img"
      >
        <img :src="props.img" />
      </div>
    </div>

    <div class="ms-2">
      <p class="font-weight-bold">คุณมีข้อความใหม่ !</p>
      <p v-if="type === MsgType.TEXT">{{ props.msg }}</p>
      <p v-if="type === MsgType.STICKER">{{ props.senderName }} ส่งสติกเกอร์</p>
      <p v-if="type === MsgType.IMAGE">{{ props.senderName }} ส่งรูปภาพ</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MsgType } from '~/composables/msgType'

const props = defineProps<{
  img?: string
  msg?: string
  type: string
  senderName: string
}>()
</script>
<style></style>
