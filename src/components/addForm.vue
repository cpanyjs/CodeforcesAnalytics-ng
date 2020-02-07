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
      <a-button type="primary" @click="showDrawer = true">批量添加</a-button>
      <a-drawer
        title="批量添加"
        placement="right"
        :closable="true"
        :width="360"
        @close="showDrawer = false"
        :visible="showDrawer"
      >
        <div>
          <a-button type="primary" @click="multiAdd">添加</a-button>
          <span style="margin-left: 10px;">格式：姓名,Handle</span>
        </div>
        <a-textarea
          v-model="text"
          style="margin-top: 20px;"
          placeholder=""
          :autosize="{ minRows: 25, maxRows: 25 }"
        />
      </a-drawer>
    </a-form-item>
    <a-form-item>
      <a-button type="danger" @click="clear">清空</a-button>
    </a-form-item>
    <a-progress v-if="percent >= 0" :percent="percent" />
  </a-form>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { addUser, clear } from '../store';

function sleep(time) {
  return new Promise((res, rej) => {
    setTimeout(res, time);
  });
}

@Component
export default class User extends Vue {
  loading = false;
  showDrawer = false;
  text = '';
  percent = -1;
  data() {
    return {
      form: this.$form.createForm(this)
    };
  }
  async multiAdd() {
    const body = this.text
      .split('\n')
      .map(s => s.split(',').map(s => s.trim()))
      .filter(s => s.length === 2);
    this.showDrawer = false;
    const n = body.length;
    this.percent = 0;
    let cnt = 0;
    for (const [name, handle] of body) {
      try {
        if (await addUser(name, handle)) {
          await sleep(500);
        }
      } catch (error) {
        this.$message.error(`获取 ${handle} 信息失败`, 10);
      }
      cnt++;
      this.percent = Number(((cnt / n) * 100.0).toFixed(0));
    }
    setTimeout(() => {
      this.percent = -1;
    }, 2000);
  }
  async clear() {
    clear();
  }
  handleSubmit() {
    this.form.validateFields(async (err, values) => {
      if (err) return;
      this.loading = true;
      await addUser(values.name, values.handle);
      this.loading = false;
      this.form.resetFields();
    });
  }
}
</script>

<style></style>
