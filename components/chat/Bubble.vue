<template>
  <div
    class="text-center"
    :class="{
      'tw-hidden': useDayjs()(props.date).format('ddd, DD/MM/YYYY') === 'Invalid Date',
    }"
  >
    <v-chip color="info">
      <span class="tw-text-xs">
        {{
          useDayjs()(props.date).format('ddd, DD/MM/YYYY') !== 'Invalid Date'
            ? useDayjs()(props.date).format('ddd, DD/MM/YYYY')
            : null
        }}
      </span>
    </v-chip>
  </div>
  <div
    class="tw-chat"
    :class="isOwner ? 'tw-chat-end' : 'tw-chat-start'"
  >
    <div
      class="tw-chat-image tw-avatar"
      :class="props.msgType !== 'text' ? 'tw-row-auto' : ''"
    >
      <div class="tw-w-10 tw-rounded-full">
        <img :src="props.img" />
      </div>
    </div>
    <div class="tw-chat-header">
      <time class="tw-text-xs tw-opacity-50 tw-ms-2">
        {{ useDayjs()(props.time).format('HH:mm') }}
      </time>
    </div>
    <!-- #555555 -->
    <div
      class="tw-chat-bubble text-secondary"
      :class="isOwner ? 'tw-bg-[#d4caff]' : 'tw-bg-[#fff]'"
      v-if="props.msgType === 'text'"
    >
      {{ props.msgText }}
    </div>

    <div
      class="tw-chat-bubble tw-bg-transparent"
      v-if="props.msgType !== 'text'"
    >
      <img :src="props.msgSticker" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  name?: string
  img?: string
  msgType: string
  msgText?: string
  msgSticker?: string
  date?: any
  time?: number
  isOwner?: boolean
}>()
</script>
