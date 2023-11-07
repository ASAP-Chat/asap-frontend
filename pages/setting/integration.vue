<template>
  <div class="mt-6 mx-auto">
    <v-table
      fixed-header
      class="tw-bg-[#F2F2F2]"
      width="100px"
    >
      <thead>
        <tr class="tw-text-sm">
          <th class="text-left font-weight-bold tw-w-64">ชื่อช่องทาง</th>
          <th class="text-left font-weight-bold tw-w-64">สถานะ</th>
          <th class="text-left tw-w-64"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="tw-text-sm"
          v-for="item in socialInfo"
          :key="item.name"
        >
          <td class="font-weight-bold">
            <v-icon
              class="mr-3 mb-1"
              size="x-large"
              :color="getSocialColor(item.socialType)"
            >
              {{ getSocialIcon(item.socialType) }}
            </v-icon>
            {{ item.name }}
          </td>
          <td :class="item.status ? 'text-info' : 'text-error'">
            <v-icon
              :color="item.status ? 'info' : 'error'"
              size="sm"
              class="mr-1"
              >{{
                item.status ? 'mdi-check-circle' : 'mdi-alert-circle'
              }}</v-icon
            >{{ item.status ? 'พร้อมใช้งาน' : 'พบปัญหา' }}
          </td>
          <td class="text-center">
            <v-btn
              variant="flat"
              class="font-weight-bold"
              color="error"
              >ยกเลิกการเชื่อมต่อ</v-btn
            >
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td class="text-center">
            <v-btn
              variant="flat"
              class="font-weight-bold tw-mx-auto"
              color="info"
              >เพิ่มการเชื่อมต่อ</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <div class="text-center mt-4"></div>
</template>
<script setup lang="ts">
useHead({
  title: 'การตั้งค่า',
})
definePageMeta({
  layout: 'setting',
})

const socialInfo = [
  {
    name: 'TestLINEOA',
    status: false,
    socialType: 'LINE',
  },
  {
    name: 'TestFacebook',
    status: false,
    socialType: 'FACEBOOK',
  },
  {
    name: 'TestIG',
    status: true,
    socialType: 'INSTAGRAM',
  },
]

const getSocialColor = (socialType: string) => {
  switch (socialType) {
    case SocialType.line:
      return '#02c153'
    case SocialType.fb:
      return '#0765FF'
    default:
      return ''
  }
}

const getSocialIcon = (socialType: string) => {
  switch (socialType) {
    case SocialType.line:
      return 'fa:fa-brands fa-line'
    case SocialType.fb:
      return 'fa:fa-brands fa-square-facebook'
    case SocialType.ig:
      return 'mdi-instagram'
    default:
      return ''
  }
}
</script>
<style>
.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
  background-color: #f2f2f2;
}
</style>
