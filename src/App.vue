<template>
  <a-layout style="height: 100%;">
    <a-layout-header>
      <header-nav></header-nav>
    </a-layout-header>
    <a-layout-content style="padding: 16px 50px;">
      <router-view
        style="background-color: white; padding: 20px; height: 100%;"
      />
    </a-layout-content>
  </a-layout>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import HeaderNav from './components/nav';

@Component({
  components: { HeaderNav }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.ant-layout-header {
  background-color: white !important;
  border-bottom: 1px solid #e8e8e8;
}
</style>
