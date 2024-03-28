<template>
  <div class="px-9 pt-9">
    <div class="tw-flex tw-justify-between mb-7">
      <div class="tw-flex tw-items-center">
        <span class="tw-text-xl font-weight-bold text-primary">{{
          chatTemplateData.data.length
        }}</span>
        &nbsp; รูปแบบคำตอบ
      </div>
      <div class="tw-flex tw-gap-3 tw-items-center tw-w-96">
        <v-text-field
          density="compact"
          variant="outlined"
          color="primary"
          rounded="lg"
          placeholder="ค้นหา"
          bg-color="white"
          hide-details
          v-model="searchKeyword"
        >
          <template v-slot:prepend-inner>
            <v-icon color="primary">mdi-magnify</v-icon>
          </template>
        </v-text-field>
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
      :page="page"
    />

    <div
      id="scrollableDiv"
      class="tw-rounded-3xl tw-justify-items-center bg-white tw-px-8 tw-pt-8 tw-overflow-y-auto"
      :class="{ 'bg-transparent tw-text-center mt-12': filteredTemplateData.length === 0 }"
      style="max-height: calc(100vh - 200px)"
    >
      <div
        :class="{
          'tw-grid tw-grid-cols-1 sm:tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-10 pb-8':
            filteredTemplateData.length !== 0,
        }"
      >
        {{ filteredTemplateData.length === 0 ? 'ไม่พบรูปแบบคำตอบที่คุณค้นหา' : '' }}

        <ChatTemplateCard
          v-for="item in filteredTemplateData.sort((a:any, b:any) => {
          const dateA = new Date(a.updatedAt)
          const dateB = new Date(b.updatedAt)

          return dateB.getTime() - dateA.getTime()
        })"
          :id="item._id"
          :keyword="item.keyword"
          :template="item.template"
          :allow-edit="role !== Role.AGENT"
          @edit="storeEdit(item._id, item.keyword, item.template)"
        />
      </div>
      <div v-if="pageCount > 0 && filteredTemplateData.length !== 0">
        <v-pagination
          v-model="page"
          :length="pageCount"
          rounded="circle"
          @click="changePagination"
        ></v-pagination>
      </div>
    </div>

    <ChatTemplateEditModal
      v-model="editDialog"
      :id="selectedTemplate?.id"
      :keyword="selectedTemplate?.keyword"
      :template="selectedTemplate?.template"
      :page="page"
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
const page = ref(1)
const chatTempDialog = ref(false)
const editDialog = ref(false)
const { chatTemplateData } = await getChatTemplate(page.value)
const pageCount = computed(() => {
  return chatTemplateData.value.pageCount
})
const user: any = useCookie(USER)
const { role } = user.value && user.value

function scrollToTop() {
  var scrollableDiv = document.getElementById('scrollableDiv')
  if (scrollableDiv) {
    scrollableDiv.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const changePagination = () => {
  getChatTemplate(page.value)
  scrollToTop()
}

const selectedTemplate = ref<any>({
  _id: '',
  keyword: '',
  template: '',
})

const storeEdit = (id: string, keyword: string, template: string) => {
  editDialog.value = true
  selectedTemplate.value = { id, keyword, template }
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
