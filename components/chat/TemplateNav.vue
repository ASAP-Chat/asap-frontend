<template>
  <v-navigation-drawer
    permanent
    width="300"
    location="right"
    v-model="templateDrawer"
    order="1"
  >
    <div class="pa-3 pt-6">
      <div class="text-center mb-3">
        <h2>คลังคำตอบ ({{ chatTemplateData.data.length }})</h2>
      </div>
      <div class="mb-2">
        <v-text-field
          density="compact"
          variant="outlined"
          color="primary"
          rounded
          placeholder="ค้นหา"
          bg-color="white"
          hide-details
          v-model="searchKeyword"
        >
          <template v-slot:prepend-inner>
            <v-icon color="primary">mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="tw-overflow-auto tw-h-4/5">
      <div
        v-for="item in filteredTemplateData"
        class="mb-6 tw-flex tw-justify-center"
      >
        <ChatTemplateCard
          :id="item._id"
          :keyword="item.keyword"
          :template="item.template"
          :allow-edit="false"
          :width="250"
          @click="updateSendMsg(item.template)"
        />
      </div>
    </div>
  </v-navigation-drawer>
  <v-app-bar
    :elevation="0"
    class="tw-border-b"
    order="3"
  >
    <template v-slot:append>
      <ChatStatus
        :id="props.id"
        :status="props.status"
      />
      <v-btn
        icon="mdi-message-text-outline"
        color="primary"
        @click.stop="templateDrawer = !templateDrawer"
        :disabled="storeSelectCus?.agent !== displayName"
      ></v-btn>
    </template>
    <template v-slot:prepend>
      <v-img
        :width="40"
        :height="40"
        aspect-ratio="1/1"
        cover
        class="tw-rounded-full"
        :src="
          storeSelectCus.source === SocialType.FACEBOOK ? profileSrc : storeSelectCus.pictureUrl
        "
      ></v-img>
    </template>
    <v-app-bar-title class="font-weight-bold">
      <v-icon
        class="pb-6"
        size="x-small"
        >{{ generateSocialIcon(storeSelectCus.source) }}</v-icon
      >
      {{ storeSelectCus.displayName }}
    </v-app-bar-title>
  </v-app-bar>
</template>
<script setup lang="ts">
import { getChatTemplate } from '~/services/message.service'
import profileSrc from '~/assets/images/profile.png'
import { USER } from '~/constants/Token'
import { SocialType } from '~/interfaces/social.interface'

const props = defineProps<{
  id: string
  status: any
}>()

const emit = defineEmits()

const updateSendMsg = (item: string) => {
  emit('update:sendMsg', item)
}
const user: any = useCookie(USER)
const { displayName } = user.value && user.value

const templateDrawer = ref(false)
const storeSelectCus: any = useCookie('storeSelectCus')
const { chatTemplateData } = await getChatTemplate()
const searchKeyword = ref('')
const filteredTemplateData = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim()
  return chatTemplateData.value.data
    .sort((a: any, b: any) => {
      const keywordA = a.keyword.toLowerCase()
      const keywordB = b.keyword.toLowerCase()

      return keywordA.localeCompare(keywordB, 'th', { sensitivity: 'base' })
    })
    .filter((item: any) => {
      return (
        item.keyword.toLowerCase().includes(keyword) ||
        item.template.toLowerCase().includes(keyword)
      )
    })
})
</script>
