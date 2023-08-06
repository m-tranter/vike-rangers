<template>
  <nav role="navigation" aria-label="Results data navigation">
    <ul class="pagination d-flex flex-wrap mb-2 ms-0">
      <li class="page-item" v-bind:class="{ disabled: pageIndex === 0 }">
        <button
          class="page-link"
          type="button"
          v-on:click="goToPage(pageIndex - 1)"
        >
          Previous
        </button>
      </li>
      <li
        v-for="(pageBtn, i) in pageBtns"
        class="page-item"
        v-bind:class="{ disabled: pageIndex === i }"
        v-bind:key="pageBtn"
      >
        <button class="page-link" type="button" v-on:click="goToPage(i)">
          {{ pageBtn }}
        </button>
      </li>
      <li
        class="page-item"
        v-bind:class="{ disabled: pageIndex + 1 === pageCount }"
      >
        <button
          class="page-link"
          type="button"
          v-on:click="goToPage(pageIndex + 1)"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'pagination',
  computed: {
    pageBtns() {
      return this.$store.state.pageBtns;
    },
    pageIndex() {
      return this.$store.state.pageIndex;
    },
    pageCount() {
      return this.$store.state.pageCount;
    }
  },
  methods: {
    goToPage(i) {
      this.$store.dispatch('goToPage', i);
      document.getElementById('contentTypesContainer').scrollIntoView();
    },
  },
};
</script>
