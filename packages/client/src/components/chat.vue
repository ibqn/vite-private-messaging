<script setup lang="ts">
import type { User } from "server/src/types"
import { ref } from "vue"

const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
</script>

<template>
  <div class="flex flex-row">
    <div class="bg-[#3f0e40]">left</div>
    <div>chat</div>
  </div>
</template>
