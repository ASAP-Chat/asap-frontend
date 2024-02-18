<template>
  <div class="pa-9">
    <div class="tw-flex tw-justify-between mb-7">
      <div class="tw-flex tw-items-center">
        <span class="tw-text-xl font-weight-bold text-primary">{{
          chatTemplateData.data.length
        }}</span>
        &nbsp; รูปแบบคำตอบ
      </div>
      <div class="tw-flex tw-gap-3 tw-items-center tw-w-96">
        <CommonTextField
          rounded="lg"
          placeholder="ค้นหา"
          prepend-inner-icon="mdi-magnify"
          bg-color="white"
          hide-details
          v-model="searchKeyword"
        />
        <v-btn
          v-if="role !== Role.AGENT"
          prepend-icon="mdi-plus"
          color="primary"
          class="font-weight-bold"
          flat
          rounded="lg"
          @click="chatTempDialog = true"
        >
          <template v-slot:prepend> <v-icon color="white"></v-icon> </template>เพิ่มใหม่
        </v-btn>
      </div>
    </div>
    <ChatTemplateCreateModal
      v-model="chatTempDialog"
      @close-modal="chatTempDialog = false"
    />
    <div
      class="tw-justify-items-center tw-overflow-y-auto custom-scrollbar tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-1 lg:tw-grid-cols-1 xl:tw-grid-cols-3"
    >
      <div
        v-for="item in filteredTemplateData.sort((a:any, b:any) => {
          const dateA = new Date(a.updatedAt)
          const dateB = new Date(b.updatedAt)

          return dateB.getTime() - dateA.getTime()
        })"
        class="mb-6"
      >
        <ChatTemplateCard
          :id="item._id"
          :keyword="item.keyword"
          :template="item.template"
          :allow-edit="role !== Role.AGENT"
          @edit="storeEdit(item._id, item.keyword, item.template)"
        />
      </div>
    </div>
    <ChatTemplateEditModal
      v-model="editDialog"
      :id="selectedTemplate?.id"
      :keyword="selectedTemplate?.keyword"
      :template="selectedTemplate?.template"
      @close-modal="editDialog = false"
    />
  </div>
</template>
<script setup lang="ts">
import { USER } from '~/constants/Token'
import { getChatTemplate } from '../services/message.service'
import { Role } from '~/constants/Role'
useHead({
  title: 'รูปแบบคำตอบ',
})
const chatTempDialog = ref(false)
const editDialog = ref(false)
const { chatTemplateData } = await getChatTemplate()
const user: any = useCookie(USER)
const { role } = user.value && user.value

const selectedTemplate = ref<any>({
  _id: '',
  keyword: '',
  template: '',
})
const setSelectTemplate = async (id: string, keyword: string, template: string) => {
  selectedTemplate.value = { id, keyword, template }
}
const storeEdit = (id: string, keyword: string, template: string) => {
  editDialog.value = true
  setSelectTemplate(id, keyword, template)
}

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
