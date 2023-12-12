<template>
  <div
    class="text-center"
    :class="{
      'tw-hidden': useDayjs()(prop.date).format('ddd, DD/MM/YYYY') === 'Invalid Date',
    }"
  >
    <v-chip color="info">
      <span class="tw-text-xs">
        {{
          useDayjs()(prop.date).format('ddd, DD/MM/YYYY') !== 'Invalid Date'
            ? useDayjs()(prop.date).format('ddd, DD/MM/YYYY')
            : null
        }}
      </span>
    </v-chip>
  </div>
  <div
    class="tw-chat"
    :class="[
      isOwner ? 'tw-chat-end' : 'tw-chat-start',
      prop.msgType !== MsgType.TEXT ? '' : 'tw-drop-shadow-lg',
    ]"
  >
    <div
      class="tw-chat-image tw-avatar"
      :class="prop.msgType !== MsgType.TEXT ? 'tw-row-auto' : ''"
    >
      <div
        class="tw-w-10 tw-rounded-full"
        v-if="prop.img"
      >
        <img :src="prop.img" />
      </div>
      <div
        class="tw-w-10 tw-rounded-full"
        v-else
      >
        <v-icon size="x-large">mdi-account-circle-outline</v-icon>
      </div>
    </div>
    <div class="tw-chat-header">
      <time class="tw-text-xs tw-opacity-50 tw-ms-2">
        {{ useDayjs()(prop.time).format('HH:mm') }}
      </time>
    </div>
    <div
      class="tw-chat-bubble text-secondary"
      :class="isOwner ? 'tw-bg-[#d4caff]' : 'tw-bg-[#fff]'"
      v-if="prop.msgType === MsgType.TEXT"
    >
      {{ prop.msgText }}
    </div>

    <div
      class="tw-chat-bubble tw-bg-transparent"
      v-if="prop.msgType === MsgType.STICKER"
    >
      <img :src="prop.msgSticker" />
    </div>
    <div
      class="tw-chat-bubble tw-bg-transparent pa-0"
      v-if="prop.msgType === MsgType.IMAGE"
    >
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          :class="{ 'on-hover tw-opacity-50	': isHovering }"
          v-bind="props"
          variant="flat"
        >
          <a
            :href="prop.msgLink"
            target="_blank"
          >
            <v-img
              :width="266"
              cover
              :src="prop.msgLink"
            ></v-img>
          </a>
        </v-card>
      </v-hover>
    </div>
    <div
      class="tw-chat-bubble tw-bg-transparent pa-0"
      v-if="prop.msgType === MsgType.VIDEO"
    >
      <video
        width="200"
        controls
      >
        <source
          :src="prop.msgLink"
          type="video/mp4"
        />
      </video>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MsgType } from '~/interfaces/message.interface'

const prop = defineProps<{
  name?: string
  img?: string
  msgType: string
  msgText?: string
  msgSticker?: string
  msgLink?: string
  date?: any
  time?: number
  isOwner?: boolean
}>()
</script>
