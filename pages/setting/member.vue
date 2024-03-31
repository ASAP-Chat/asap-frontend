<template>
  <div class="tw-flex tw-justify-between mb-4">
    <div class="tw-flex tw-items-center">
      <span class="tw-text-xl font-weight-bold text-primary">{{ memberData?.data.length }}</span>
      &nbsp; คน
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
        v-model="search"
      >
        <template v-slot:prepend-inner>
          <v-icon color="primary">mdi-magnify</v-icon>
        </template>
      </v-text-field>
      <CommonButton
        text="เพิ่มสมาชิก"
        icon="mdi-plus"
        color="primary"
        @click="createMemberModal = true"
      />
    </div>
  </div>
  <div class="bg-white tw-rounded-3xl tw-px-8 tw-pt-4 tw-mt-12">
    <v-data-table
      :sort-by="sortBy"
      :headers="headers"
      :items="memberData.data"
      item-value="_id"
      :search="search"
      color="primary"
      class="tw-rounded-lg"
    >
      <template v-slot:item.displayName="{ item }">
        <div>
          <p>
            {{ item.displayName ? item.displayName : '-' }}
            <span
              class="text-secondary-lighten"
              v-if="item.displayName === displayName"
              >(คุณ)</span
            >
          </p>
        </div>
      </template>
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
          v-if="
            (role !== Role.MANAGER || (role === Role.MANAGER && item.role !== Role.OWNER)) &&
            !(calculateOwnerCount === 1 && item.role === Role.OWNER) &&
            item.displayName !== displayName
          "
          size="small"
          color="primary"
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
    :content="`คุณยืนยันที่จะลบ <b>${
      selectedMember?.displayName ? selectedMember?.displayName : selectedMember?.email
    }</b> ตำแหน่ง <b>${generateRole(selectedMember?.role)}</b> ออกจากการเป็นสมาชิกใช่หรือไม่?`"
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
const { role, displayName } = user.value

const calculateOwnerCount = computed(() => {
  return memberData.value.data.filter((item) => item.role === 'owner').length
})

const headers: any[] = [
  {
    title: 'ชื่อสมาชิก',
    align: 'start',
    key: 'displayName',
    sortable: false,
    class: 'tw-text-lg text-left tw-text-[#464646]',
  },

  { title: 'อีเมล', align: 'start', key: 'email', sortable: false },
  {
    title: 'บทบาท',
    align: 'start',
    key: 'role',
    value: (item: any) => generateRole(item.role),
    sortable: false,
  },
  { title: '', align: 'center', key: 'status', sortable: false },
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

.v-data-table-header__content {
  font-size: 18px;
  color: #464646;
}
</style>
