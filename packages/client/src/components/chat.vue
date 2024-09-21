<script setup lang="ts">
import { socket } from "@/socket"
import type { User } from "server/src/types"
import { onMounted, onUnmounted, ref } from "vue"
import UserPanel from "@/components/user-panel.vue"
import MessagePanel from "@/components/message-panel.vue"

const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)

onMounted(() => {
  socket.on("connect", () => {
    console.log("connected")
    users.value.forEach((user) => {
      if (user.self) {
        user.connected = true
        console.log("user connected", user)
      }
    })
  })

  socket.on("disconnect", () => {
    users.value.forEach((user) => {
      if (user.self) {
        user.connected = false
      }
    })
  })

  const initReactiveProperties = (user: User) => {
    user.self = user.userId === socket.userId
    user.hasNewMessages = false
    user.connected = true
  }

  socket.on("users", (incomingUsers: User[]) => {
    incomingUsers.forEach((user) => {
      user.self = user.userId === socket.userId
      initReactiveProperties(user)
    })

    incomingUsers.sort((a, b) => {
      if (a.self) return -1
      if (b.self) return 1
      if (a.username < b.username) return -1
      return a.username > b.username ? 1 : 0
    })

    users.value = incomingUsers
  })

  socket.on("user connected", (incomingUser: User) => {
    const user = users.value.find((user) => user.userId === incomingUser.userId)
    if (user) {
      user.connected = true
      return
    }
    initReactiveProperties(incomingUser)
    users.value.push(incomingUser)
  })

  socket.on("user disconnected", (userId: string) => {
    const user = users.value.find((user) => user.userId === userId)
    if (user) {
      user.connected = false
    }
  })

  socket.on("private message", ({ content, from, to }) => {
    const fromSelf = socket.userId === from
    const user = users.value.find(
      (user) => user.userId === (fromSelf ? to : from)
    )
    if (user) {
      user.messages = [...(user.messages ?? []), { content, fromSelf }]
      if (user.userId !== selectedUser.value?.userId) {
        user.hasNewMessages = true
      }
    }
  })
})

onUnmounted(() => {
  socket.off("connect")
  socket.off("disconnect")
  socket.off("users")
  socket.off("user connected")
  socket.off("user disconnected")
  socket.off("private message")
})

const onSelectUser = (user: User) => {
  selectedUser.value = user
  user.hasNewMessages = false
}

const onMessage = (content: string) => {
  if (!selectedUser.value) {
    return
  }

  socket.emit("private message", { to: selectedUser.value?.userId, content })
  selectedUser.value.messages = [
    ...(selectedUser.value?.messages ?? []),
    { content, fromSelf: true },
  ]
}
</script>

<template>
  <div class="flex max-h-full min-h-screen min-w-full flex-row">
    <div class="w-64 bg-[#3f0e40] text-white">
      <UserPanel
        v-for="user in users"
        :key="user.userId"
        :user="user"
        @select="onSelectUser(user)"
        :selected="selectedUser?.userId === user.userId"
      />
    </div>
    <MessagePanel v-if="selectedUser" @input="onMessage" :user="selectedUser" />
  </div>
</template>
