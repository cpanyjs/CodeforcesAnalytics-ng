<template>
  <a-table
    :columns="columns"
    :rowKey="item => item.handle"
    :dataSource="users"
    :pagination="false"
    bordered
  >
    <template slot="handle" slot-scope="text, record">
      <a
        :href="`https://codeforces.com/profile/${text}`"
        :style="{ fontWeight: 'bold', color: getColor(record.rating) }"
        >{{ text }}</a
      >
    </template>
    <span
      slot="color"
      slot-scope="text"
      :style="{ fontWeight: 'bold', color: getColor(text) }"
    >
      {{ text }}
    </span>
    <template slot="operation" slot-scope="text, record">
      <a-button type="primary">刷新</a-button>
      <a-button
        type="danger"
        style="margin-left: 10px;"
        @click="$store.commit('delUser', record)"
        >删除</a-button
      >
    </template>
  </a-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class userTable extends Vue {
  columns = [
    {
      title: 'Handle',
      dataIndex: 'handle',
      key: 'handle',
      scopedSlots: { customRender: 'handle' }
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      scopedSlots: { customRender: 'color' }
    },
    {
      title: '历史最高 Rating',
      dataIndex: 'maxRating',
      scopedSlots: { customRender: 'color' }
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' }
    }
  ];

  get users() {
    return this.$store.state.users;
  }

  getColor(rating: number) {
    if (rating < 1200) return 'gray';
    if (rating < 1400) return 'green';
    if (rating < 1600) return '#03A89E';
    if (rating < 1900) return 'blue';
    if (rating < 2100) return '#a0a';
    if (rating < 2400) return '#FF8C00';
    return 'red';
  }
}
</script>

<style></style>
