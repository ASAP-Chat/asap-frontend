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
      <div>
        <CommonTextField
          rounded
          placeholder="ค้นหา"
          prepend-inner-icon="mdi-magnify"
          bg-color="white"
          v-model="searchKeyword"
        />
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
        @click.stop="templateDrawer = !templateDrawer"
      ></v-btn>
    </template>
    <template v-slot:prepend>
      <v-img
        :width="40"
        :height="40"
        aspect-ratio="1/1"
        cover
        class="tw-rounded-full"
        :src="storeSelectCus.pictureUrl ? storeSelectCus.pictureUrl : profileSrc"
      ></v-img>
    </template>
    <v-app-bar-title class="font-weight-bold">
      <v-icon
        :color="generateSocialColor(storeSelectCus.source)"
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

const props = defineProps<{
  id: string
  status: any
}>()

const emit = defineEmits()

const updateSendMsg = (item: string) => {
  emit('update:sendMsg', item)
}

const templateDrawer = ref(false)
const storeSelectCus: any = useCookie('storeSelectCus')
const { chatTemplateData } = await getChatTemplate()
const searchKeyword = ref('')
const filteredTemplateData = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim()
  return chatTemplateData.value.data
    .sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt)
      const dateB = new Date(b.updatedAt)

      return dateA.getTime() - dateB.getTime()
    })
    .filter((item: any) => {
      return (
        item.keyword.toLowerCase().includes(keyword) ||
        item.template.toLowerCase().includes(keyword)
      )
    })
})
</script>
