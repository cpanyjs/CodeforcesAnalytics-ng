<template>
  <div></div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    name: String,
    handle: String
  }
})
export default class Profile extends Vue {}
</script>

<style></style>
