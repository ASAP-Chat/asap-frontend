<template>
  <div class="tw-flex tw-justify-between mb-4">
    <div class="tw-flex tw-items-center">
      <span class="tw-text-xl font-weight-bold text-primary">{{ memberData?.data.length }}</span>
      &nbsp; คน
    </div>
    <div class="tw-flex tw-gap-3 tw-items-center tw-w-96">
      <CommonTextField
        rounded="lg"
        placeholder="ค้นหา"
        prepend-inner-icon="mdi-magnify"
        bg-color="white"
        hide-details
        v-model="search"
      />
      <v-btn
        prepend-icon="mdi-plus"
        color="primary"
        class="font-weight-bold"
        flat
        rounded="lg"
        @click="createMemberModal = true"
      >
        <template v-slot:prepend> <v-icon color="white"></v-icon> </template>เพิ่มสมาชิก
      </v-btn>
    </div>
  </div>
  <div>
    <v-data-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="memberData.data"
      item-value="_id"
      :search="search"
      class="tw-rounded-lg tw-bg-transparent"
    >
      <template v-slot:item.status="{ item }">
        <div>
          <v-chip
            v-if="item.status === 'pending'"
            color="orange"
            text="รอดำเนินการ"
            label
            size="small"
          ></v-chip>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="role !== Role.MANAGER || (role === Role.MANAGER && item.role !== Role.OWNER)"
          size="small"
          @click=";(selectedMember = item), (confirmDelete = true)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
  <member-create-modal
    v-model="createMemberModal"
    @close-modal="createMemberModal = false"
  />
  <CommonConfirmModal
    v-model="confirmDelete"
    header="ลบสมาชิก"
    content="คุณยืนยันจะลบสมาชิกนี้ใช่หรือไม่?"
    cancelWording="ยกเลิก"
    confirmWording="ยืนยัน"
    :isSuccess="false"
    @btn-action="confirmDelete = false"
    @confirm-action="deleteItem(selectedMember)"
  />
</template>
<script setup lang="ts">
// @ts-nocheck

import { ACCESS_TOKEN, USER } from '~/constants/Token'
import { getMember } from '~/services/member.service'
import { useToast } from 'vue-toastification'
import { Role } from '~/constants/Role'

useHead({
  title: 'การตั้งค่า',
})
definePageMeta({
  layout: 'setting',
})
const { memberData } = await getMember()
const search = ref('')
const createMemberModal = ref(false)
const confirmDelete = ref(false)
const access_token = useCookie(ACCESS_TOKEN)
const toast = useToast()
const selectedMember = ref()
const user: any = useCookie(USER)
const { role } = user.value

const calculateOwnerCount = computed(() => {
  return memberData.value.data.filter((item) => item.role === 'owner').length
})
console.log('🍪🥛 ~ calculateOwnerCount ~ calculateOwnerCount:', calculateOwnerCount.value)

const headers: any[] = [
  {
    title: 'ชื่อสมาชิก',
    align: 'start',
    key: 'displayName',
    value: (item: any) => (item.displayName ? item.displayName : '-'),
  },
  { title: 'อีเมล', align: 'start', key: 'email' },
  {
    title: 'บทบาท',
    align: 'center',
    key: 'role',
    value: (item: any) => generateRole(item.role),
  },
  { title: '', align: 'center', key: 'status' },
  { title: '', key: 'actions', sortable: false },
]
const sortBy = [{ key: 'role', order: 'desc' }]

const deleteItem = async (item: any) => {
  confirmDelete.value = true
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/team-member/${item._id}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status.value === 'success') {
      close()
      toast.success('ลบสมาชิกสำเร็จ', useToastOption)
      confirmDelete.value = false
      await getMember()
    } else {
      await useRefreshToken()
      toast.error('ลบสมาชิกไม่สำเร็จ, โปรดลองอีกครั้ง', useToastOption)
      console.log(`Request failed with status: ${response.error.value}`)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
<style>
.v-data-table-header__content {
  font-weight: bold;
}
</style>
