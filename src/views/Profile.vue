<template>
  <div v-if="user">
    <h2
      :style="{
        fontWeight: 'bold',
        color: getColor(user.rating),
        marginBottom: 0
      }"
    >
      {{ user.rank | firstUpper }}
    </h2>
    <h1 v-if="name">
      {{ name }}
      <a
        :href="`https://codeforces.com/profile/${user.handle}`"
        :style="{ fontWeight: 'bold', color: getColor(user.rating) }"
        >{{ user.handle }}</a
      >
    </h1>
    <h1 v-else>
      <a
        :href="`https://codeforces.com/profile/${handle}`"
        :style="{ fontWeight: 'bold', color: getColor(user.rating) }"
        >{{ handle }}</a
      >
    </h1>

    <pie-chart :data="user"></pie-chart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { User, getUser } from '../services/cf';
import { getNameInfo } from '../store/index';
import { getColor } from '../util';
import { Route } from 'vue-router';
import PieChart from '../components/chart.vue';

@Component({
  props: {
    name: String,
    handle: String
  },
  components: {
    PieChart
  },
  filters: {
    firstUpper(v: string) {
      let s = [' '];
      for (let i = 0; i < v.length; i++) {
        if (s[s.length - 1] === ' ') {
          s.push(v[i].toUpperCase());
        } else {
          s.push(v[i]);
        }
      }
      s.splice(0, 1);
      return s.join('');
    }
  }
})
export default class Profile extends Vue {
  @Prop(String) name!: string | undefined;
  @Prop(String) handle!: string | undefined;

  user: User | null = null;

  async mounted() {
    if (this.name) {
      const user = await getNameInfo(this.name);
      if (user) {
        this.user = user;
      } else {
        this.$router.replace('home');
      }
    } else if (this.handle) {
      try {
        this.user = await getUser(this.handle);
      } catch (error) {
        this.$router.replace('home');
      }
    } else {
      this.$router.replace('home');
    }
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Function) {
    if (to.query.name) {
      const user = await getNameInfo(to.query.name as string);
      if (user) {
        this.user = user;
        this.$forceUpdate();
      } else {
        next('home');
      }
    } else if (to.query.handle) {
      try {
        this.user = await getUser(to.query.handle as string);
        this.$forceUpdate();
      } catch (error) {
        next('home');
      }
    } else {
      next('home');
    }
  }

  getColor = getColor;
}
</script>

<style></style>
