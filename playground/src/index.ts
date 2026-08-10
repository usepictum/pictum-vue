import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const root = document.querySelector("#app");

if (root === null) {
	throw new Error("Missing playground root element.");
}

createApp(App).mount(root);
