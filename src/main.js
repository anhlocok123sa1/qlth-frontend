import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  FormItem,
  Input,
  InputPassword,
  List,
  Menu,
  message,
  RadioGroup,
  Radio,
  Select,
  Tabs,
  Table,
  QRCode,
  Modal,
  InputNumber
} from "ant-design-vue";
import { createPinia } from "pinia";
import axios from './axios'; // Import axios instance

import "./static/fontawesome/css/all.min.css";
import "ant-design-vue/dist/reset.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap-utilities.min.css";

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(InputNumber);
app.use(Modal);
app.use(QRCode);
app.use(router);
app.use(Avatar);
app.use(Button);
app.use(Card);
app.use(Checkbox);
app.use(DatePicker);
app.use(Drawer);
app.use(Form);
app.use(FormItem);
app.use(Input);
app.use(InputPassword);
app.use(List);
app.use(Menu);
app.use(Radio);
app.use(RadioGroup);
app.use(Select);
app.use(Tabs);
app.use(Table);
app.use(pinia);
app.mount("#app");

app.config.globalProperties.$message = message;
