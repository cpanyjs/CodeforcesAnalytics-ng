import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import {
  Button,
  Layout,
  Menu,
  Icon,
  Form,
  Input,
  Table,
  Drawer
} from 'ant-design-vue';

Vue.component(Button.name, Button);
Vue.component(Icon.name, Icon);
Vue.component(Form.name, Form);
Vue.component(Form.Item.name, Form.Item);
Vue.component(Input.name, Input);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Layout.name, Layout);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Menu.ItemGroup.name, Menu.ItemGroup);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
Vue.component(Table.name, Table);
Vue.component(Drawer.name, Drawer);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
