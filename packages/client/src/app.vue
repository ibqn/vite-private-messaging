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
  const sessionId = localStorage.getItem("sessionId")
  if (sessionId) {
    isUsernameSelected.value = true
    socket.auth = { sessionId }
    socket.connect()
  }

  socket.on("session", ({ sessionId, userId }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionId }
    localStorage.setItem("sessionId", sessionId)
    socket.userId = userId
  })

  socket.on("connect_error", (error) => {
    if (error.message === "invalid username") {
      isUsernameSelected.value = false
    }
  })
})

onUnmounted(() => {
  socket.off("connect_error")
  socket.off("session")
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <Chat v-if="isUsernameSelected" />
    <SelectUsername @input="onUsernameInput" v-else />
  </div>
</template>
