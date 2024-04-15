<template>
  <v-card>
    <template v-slot:title>
      <div class="font-weight-bold">เชื่อมต่อ Instagram</div>
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
        <li>คุณต้องทำการเชื่อมต่อ Instagram Business กับ Facebook Page ก่อน</li>
        <li>เฉพาะข้อความใหม่เท่านั้นที่จะปรากฏหลังจากเชื่อมต่อ</li>
        <li>ข้อความที่ส่งจากแพลตฟอร์ม Instagram จะไม่ปรากฏใน ASAP</li>
      </ul>

      <div class="tw-flex tw-justify-center mt-4 mb-2">
        <v-btn
          block
          color="indigo-darken-1"
          size="large"
          variant="flat"
          class="font-weight-bold"
          :loading="loading"
          style="
            background: radial-gradient(
                circle farthest-corner at 0% 150%,
                rgb(255, 225, 125) 0%,
                rgb(255, 205, 105) 12%,
                rgb(250, 145, 55) 25%,
                rgb(235, 65, 65) 41%,
                transparent 95%
              ),
              linear-gradient(-15deg, rgb(35, 75, 215) -10%, rgb(195, 60, 190) 65%);
            background-size: 120% 120%;
          "
          @click="connect"
        >
          เชื่อมต่อ
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { oauthInstagram } from '~/services/instagram.service'

const emits = defineEmits(['back'])

const back = () => {
  emits('back')
}

const loading = ref(false)

const connect = async () => {
  loading.value = true
  const oauthURL = oauthInstagram()
  window.location.href = oauthURL
}
</script>
