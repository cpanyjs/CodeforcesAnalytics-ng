<template>
  <a-form layout="inline" :form="form">
    <a-form-item label="姓名" required>
      <a-input
        v-decorator="[
          'name',
          { rules: [{ required: true, message: '姓名不能为空' }] }
        ]"
      />
    </a-form-item>
    <a-form-item label="Handle" required>
      <a-input
        v-decorator="[
          'handle',
          { rules: [{ required: true, message: 'Handle 不能为空' }] }
        ]"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSubmit" :loading="loading"
        >添加</a-button
      >
    </a-form-item>
    <a-form-item>
      <a-button type="primary">批量添加</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class User extends Vue {
  loading = false;
  data() {
    return {
      form: this.$form.createForm(this)
    };
  }
  handleSubmit() {
    this.form.validateFields(async (err, values) => {
      if (err) return;
      this.loading = true;
      await this.$store.dispatch('addUser', values);
      this.loading = false;
      this.form.resetFields();
    });
  }
}
</script>

<style></style>
