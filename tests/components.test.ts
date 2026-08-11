import { afterEach, describe, expect, test, vi } from "vitest";
import type { Component } from "vue";
import {
	createApp,
	createSSRApp,
	defineComponent,
	h,
	nextTick,
	ref,
} from "vue";
import { renderToString } from "vue/server-renderer";
import {
	Avatar,
	Icon,
	PictumProvider,
	Placeholder,
	QrCode,
	useAvatar,
} from "../src";

const mountedApps: ReturnType<typeof createApp>[] = [];
const containers: HTMLElement[] = [];

afterEach(() => {
	for (const app of mountedApps) {
		app.unmount();
	}
	for (const container of containers) {
		container.remove();
	}
	mountedApps.length = 0;
	containers.length = 0;
	vi.unstubAllGlobals();
});

describe("components", () => {
	test("renders an inline icon without caller suspense and caches its canonical SVG", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke="currentColor" d="M1 1h22"/></svg>',
				),
			);
		vi.stubGlobal("fetch", fetchMock);

		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h("div", [
							h(Icon, {
								name: "lucide:vue-test-icon",
								"aria-label": "Test icon",
								class: "icon",
								options: { baseUrl: "https://icons.example.com/v1" },
							}),
							h(Icon, {
								name: "lucide:vue-test-icon",
								"aria-label": "Second test icon",
								options: { baseUrl: "https://icons.example.com/v1" },
							}),
						]);
				},
			}),
		);

		await vi.waitFor(() => {
			expect(container.querySelectorAll("svg path")).toHaveLength(2);
		});

		const svg = container.querySelector("svg");
		expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
		expect(svg).toHaveAttribute("aria-label", "Test icon");
		expect(svg).toHaveClass("icon");
		expect(svg?.querySelector("path")).toHaveAttribute(
			"stroke",
			"currentColor",
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	test("renders resolved inline icon markup during SSR", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 1h22"/></svg>',
				),
			);
		vi.stubGlobal("fetch", fetchMock);

		const html = await renderToString(
			createSSRApp({
				render: () =>
					h(Icon, {
						name: "lucide:vue-ssr-icon",
						"aria-label": "SSR icon",
					}),
			}),
		);

		expect(html).toContain('viewBox="0 0 24 24"');
		expect(html).toContain('<path d="M1 1h22"');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	test("uses provider options and lets components override them", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(
							PictumProvider,
							{ options: { baseUrl: "https://staging.example.com/v1" } },
							{
								default: () => [
									h(Avatar, { seed: "ada-lovelace", alt: "Ada" }),
									h(QrCode, {
										value: "hello",
										alt: "Hello",
										options: {
											baseUrl: "https://preview.example.com/v1",
										},
									}),
								],
							},
						);
				},
			}),
		);

		expect(container.querySelector('[alt="Ada"]')).toHaveAttribute(
			"src",
			"https://staging.example.com/v1/avatar.svg?seed=ada-lovelace",
		);
		expect(container.querySelector('[alt="Hello"]')).toHaveAttribute(
			"src",
			"https://preview.example.com/v1/qrcode.svg?data=aGVsbG8%3D",
		);
	});

	test("forwards QR code options without leaking image attributes", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(QrCode, {
							value: "https://pictum.dev",
							quietZone: false,
							foreground: "#11223344",
							background: "#aabbccdd",
							alt: "Custom QR code",
						});
				},
			}),
		);

		const image = container.querySelector('[alt="Custom QR code"]');
		expect(image).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/qrcode.svg?data=aHR0cHM6Ly9waWN0dW0uZGV2&quiet_zone=0&foreground=%2311223344&background=%23aabbccdd",
		);
		expect(image).not.toHaveAttribute("quietzone");
		expect(image).not.toHaveAttribute("foreground");
		expect(image).not.toHaveAttribute("background");
	});

	test("reacts to composable inputs", async () => {
		const seed = ref("ada-lovelace");
		const container = mount(
			defineComponent({
				setup() {
					const asset = useAvatar(seed, { format: "webp" });
					return () => h("span", asset.value.url);
				},
			}),
		);

		expect(container.textContent).toBe(
			"https://pictum.dev/v1/avatar.webp?seed=ada-lovelace",
		);

		seed.value = "grace-hopper";
		await nextTick();

		expect(container.textContent).toBe(
			"https://pictum.dev/v1/avatar.webp?seed=grace-hopper",
		);
	});

	test("renders an unfiltered portrait for the any gender", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(Avatar, {
							seed: "customer-123",
							variant: "portrait",
							gender: "any",
							alt: "Customer",
						});
				},
			}),
		);

		expect(container.querySelector('[alt="Customer"]')).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/avatar.webp?seed=customer-123&variant=portrait",
		);
	});

	test("requests a portrait source size without forwarding it to the image", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(Avatar, {
							seed: "customer-456",
							variant: "portrait",
							size: 256,
							width: 96,
							height: 128,
							alt: "Sized customer",
						});
				},
			}),
		);

		const image = container.querySelector('[alt="Sized customer"]');
		expect(image).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/avatar.webp?seed=customer-456&variant=portrait&size=256",
		);
		expect(image).toHaveAttribute("width", "96");
		expect(image).toHaveAttribute("height", "128");
		expect(image).not.toHaveAttribute("size");
	});

	test("sets placeholder logical image dimensions", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(Placeholder, {
							width: 640,
							height: 360,
							format: "webp",
							density: 3,
							text: "Coming soon",
							alt: "Coming soon",
						});
				},
			}),
		);

		const image = container.querySelector('[alt="Coming soon"]');
		expect(image).toHaveAttribute("width", "640");
		expect(image).toHaveAttribute("height", "360");
		expect(image).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/placeholder.webp?width=640&height=360&density=3&text=Coming+soon",
		);
	});
});

function mount(component: Component): HTMLElement {
	const container = document.createElement("div");
	document.body.append(container);
	const app = createApp(component);
	app.mount(container);
	mountedApps.push(app);
	containers.push(container);
	return container;
}
