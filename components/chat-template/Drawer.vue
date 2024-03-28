<template>
  <v-navigation-drawer
    permanent
    width="300"
    location="right"
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
        v-for="item in filteredTemplateData.sort((a:any, b:any) => {
          const dateA = new Date(a.updatedAt)
          const dateB = new Date(b.updatedAt)

          return dateB.getTime() - dateA.getTime()
        })"
        class="mb-6 tw-flex tw-justify-center"
      >
        <ChatTemplateCard
          :id="item._id"
          :keyword="item.keyword"
          :template="item.template"
          :allow-edit="false"
          :width="250"
          class="tw-border"
          @click="updateSendMsg(item.template)"
        />
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { getChatTemplate } from '~/services/message.service'

const emit = defineEmits()
const updateSendMsg = (item: string) => {
  emit('update:sendMsg', item)
}

const { chatTemplateData } = await getChatTemplate(1, false)
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
