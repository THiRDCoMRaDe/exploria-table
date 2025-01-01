<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useFetch } from './composables/useFetch'
import type { maybeNull, MockDataInterface } from './_core'

const _BASE_URL = location.origin
  ? location.origin
  : !!location.port
    ? `${location.protocol}//${location.hostname}:${location.port}`
    : `${location.protocol}//${location.hostname}`

const { data, error, isFetching, execute } = useFetch<MockDataInterface[]>(
  `${_BASE_URL}/_data/records.json`,
  { immediate: false },
)
const mockData: Ref<maybeNull<MockDataInterface[]>> = ref(data)
const onFetchClick = () => execute()
</script>

<template>
  <div class="u-container">
    <ul>
      <li v-for="d in mockData" :key="d.id">
        {{ d.name }}
      </li>
    </ul>
    <p>{{ isFetching }}</p>
    <p>{{ error }}</p>
    <button @click="onFetchClick()">fetch</button>
  </div>
</template>

<style></style>
