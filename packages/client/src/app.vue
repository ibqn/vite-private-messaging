<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import SelectUsername from "./components/select-username.vue"
import { socket } from "./socket"
import Chat from "./components/chat.vue"

const isUsernameSelected = ref(false)

const onUsernameInput = (username: string) => {
  console.log("username", username)
  isUsernameSelected.value = true
  socket.auth = { username }
  socket.connect()
}

onMounted(() => {
  socket.on("connect_error", (error) => {
    if (error.message === "invalid username") {
      isUsernameSelected.value = false
    }
  })
})

onUnmounted(() => {
  socket.off("connect_error")
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <Chat v-if="isUsernameSelected" />
    <SelectUsername @input="onUsernameInput" v-else />
  </div>
</template>
