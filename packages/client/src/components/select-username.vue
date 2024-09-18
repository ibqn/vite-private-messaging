<script setup lang="ts">
import { computed, ref } from "vue"

const username = ref("")

const isValid = computed(() => username.value.length > 2)

type Emits = {
  input: [username: string]
}

const emit = defineEmits<Emits>()

const onSubmit = () => {
  // console.log("username", username.value)
  emit("input", username.value)
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-2 text-sm">
    <label class="font-semibold" for="username">Username:</label>
    <input
      class="w-80 border border-slate-400 px-2 py-1"
      type="text"
      id="username"
      name="username"
      v-model="username"
      placeholder="Select your username..."
    />
    <button
      class="bg-slate-400 py-1 text-white disabled:opacity-50"
      :disabled="!isValid"
      type="submit"
    >
      Submit
    </button>
  </form>
</template>
