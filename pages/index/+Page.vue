<template>
  <div>
    <MyHeader />
    <div class="container">
      <h1>Pinia Example</h1>
    </div>
    <MyFooter />
  </div>
</template>

<script setup>

import MyFooter from '../../components/MyFooter.vue';
import MyHeader from '../../components/MyHeader.vue';
import { onServerPrefetch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounter } from '../../stores/useCounter'
import { useTodos } from '../../stores/useTodos'
import {useEntryStore} from '../../stores/entries.js'

const entryStore = useEntryStore()

//const counterStore = useCounter()
//const { count } = storeToRefs(counterStore)

//const todosStore = useTodos()
//const { todoList } = storeToRefs(todosStore)

//const loadTodos = async () => {
//  await todosStore.fetchTodoList()
//}
//onServerPrefetch(loadTodos)
//onMounted(loadTodos)
</script>
