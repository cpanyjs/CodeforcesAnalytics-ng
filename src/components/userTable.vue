<template>
  <a-table
    :columns="columns"
    :rowKey="item => item.handle"
    :dataSource="users"
    :pagination="false"
    bordered
  >
  </a-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class userTable extends Vue {
  columns = [
    {
      title: 'Handle',
      dataIndex: 'handle'
    },
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: 'Rating',
      dataIndex: 'rating'
    },
    {
      title: '历史最高 Rating',
      dataIndex: 'maxRating'
    }
  ];
  get users() {
    return this.$store.state.users;
  }
}
</script>

<style></style>
