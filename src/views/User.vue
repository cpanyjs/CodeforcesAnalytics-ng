<template>
  <div id="user">
    <add-form></add-form>
    <user-table style="margin-top: 10px;"></user-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AddForm from '@/components/addForm.vue';
import UserTable from '@/components/userTable.vue';

@Component({
  components: { AddForm, UserTable }
})
export default class User extends Vue {}
</script>

<style></style>
