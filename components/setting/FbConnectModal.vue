<template>
  <v-card>
    <template v-slot:title>
      <div class="font-weight-bold">เชื่อมต่อ Facebook Page</div>
    </template>
    <template v-slot:append>
      <v-btn
        @click="back"
        variant="text"
      >
        <v-icon
          icon="mdi-chevron-left"
          color="secondary-lighten"
        ></v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <ul class="ms-6 tw-text-sm">
        <li>คุณต้องมีสิทธิ์เป็นผู้ดูแลระบบบน LINE OA เพื่อทำการเชื่อมต่อ</li>
        <li>เฉพาะข้อความใหม่เท่านั้นที่จะปรากฏหลังจากเชื่อมต่อ</li>
        <li>ข้อความที่ส่งจากแพลตฟอร์ม LINE จะไม่ปรากฏใน ASAP</li>
      </ul>

      <v-form class="mt-4">
        <div>
          <common-text-field label="Channel Secret" />
          <common-text-field label="Channel Access Token (long-lived)" />
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        variant="text"
        color="teal-accent-4"
      >
        Learn More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
const emits = defineEmits(['back'])

const back = () => {
  emits('back')
}
</script>
