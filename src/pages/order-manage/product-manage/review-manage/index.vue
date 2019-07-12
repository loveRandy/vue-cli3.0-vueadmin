<template>
  <ul
    class="infinite-list"
    v-infinite-scroll="load"
  >
    <template v-for="(i,key) in count">
      <li
        :key="key"
        class="infinite-list-item"
      >{{ i }}</li>
    </template>
  </ul>
</template>

<script>
export default {
    data() {
        return {
            count: 0
        }
    },
    methods: {
        load() {
            this.count += 2
        }
    }
}
</script>

<style scope>
.infinite-list li{
    background:#f0f1f2;
    line-height:40px;
    margin-bottom:10px;
    text-align: center;
}
</style>
