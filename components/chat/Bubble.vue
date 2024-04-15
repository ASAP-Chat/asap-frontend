<template>
  <div
    class="text-center"
    :class="{
      'tw-hidden': useDayjs()(prop.date).format('ddd, DD MMM YYYY') === 'Invalid Date',
    }"
  >
    <v-chip color="info">
      <span class="tw-text-xs">
        {{
          useDayjs()(prop.date).format('ddd, DD MMM YYYY') !== 'Invalid Date'
            ? useDayjs()(prop.date).isSame(useDayjs()(), 'day')
              ? 'วันนี้'
              : useDayjs()(prop.date).format('ddd, DD MMM YYYY')
            : null
        }}
      </span>
    </v-chip>
  </div>

  <div
    class="tw-chat"
    :class="[isOwner ? 'tw-chat-end' : 'tw-chat-start']"
  >
    <div
      class="tw-chat-image tw-avatar"
      :class="prop.msgType !== MsgType.TEXT ? 'tw-row-auto' : ''"
    >
      <div
        class="tw-w-10 tw-rounded-full"
        v-if="prop.img"
      >
        <img
          :src="prop.img"
          alt="profile"
        />
      </div>
    </div>
    <div class="tw-chat-header">
      <time class="tw-text-xs tw-opacity-50 tw-ms-2">
        {{ useDayjs()(prop.time).format('HH:mm') }}
      </time>
    </div>
    <div
      class="tw-chat-bubble text-secondary tw-whitespace-pre-line"
      :class="isOwner ? 'tw-bg-[#d4caff]' : 'tw-bg-[#fff]'"
      v-if="prop.msgType === MsgType.TEXT"
    >
      {{ prop.msgText }}
    </div>

    <div
      class="tw-chat-bubble tw-bg-transparent"
      v-if="prop.msgType === MsgType.STICKER"
    >
      <img
        :src="prop.msgSticker"
        alt="sticker"
      />
    </div>
    <div
      class="tw-chat-bubble tw-bg-transparent pa-0"
      v-if="prop.msgType === MsgType.IMAGE"
    >
      <a
        :href="prop.msgLink"
        target="_blank"
      >
        <div>
          <v-img
            :width="266"
            cover
            :src="prop.msgLink"
            @load="imageLoaded = true"
          ></v-img>

          <v-skeleton-loader
            v-if="!imageLoaded"
            :width="266"
            type="image"
          ></v-skeleton-loader>
        </div>
      </a>
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
    <div
      class="tw-chat-bubble tw-bg-transparent pa-0"
      v-if="prop.msgType === MsgType.AUDIO"
    >
      <audio controls>
        <source
          :src="prop.msgLink"
          type="audio/mp4"
        />
      </audio>
    </div>
  </div>
  <div
    v-if="prop.msgType === MsgType.LOCATION"
    class="ml-9 bg-white tw-w-2/4 tw-rounded-lg"
  >
    <GoogleMap
      class="tw-h-52 tw-rounded-lg"
      :center="center"
      :zoom="15"
    >
      <Marker :options="{ position: center }" />
    </GoogleMap>
    <div class="tw-p-3">
      <a
        :href="msgLocation?.link || '#'"
        target="_blank"
        class="tw-no-underline tw-text-black hover:tw-text-[#674AE7]"
      >
        <p class="tw-text-lg">🚩 {{ msgLocation?.title }}</p>
        <p class="tw-text-sm">{{ msgLocation?.address }}</p>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MsgType } from '~/constants/MessageType'
import { GoogleMap, Marker } from 'vue3-google-map'

const prop = defineProps<{
  name?: string
  img?: string
  msgType?: string
  msgText?: string
  msgSticker?: string
  msgLink?: string
  msgLocation?: {
    latitude: number
    longitude: number
    title: string
    address: string
    link: string
  }
  date?: any
  time?: number
  isOwner?: boolean
}>()

const center = { lat: prop.msgLocation?.latitude, lng: prop.msgLocation?.longitude }
const imageLoaded = ref(false)
</script>
