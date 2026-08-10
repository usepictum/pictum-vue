import { afterEach, describe, expect, test, vi } from "vitest";
import type { Component } from "vue";
import { createApp, defineComponent, h, nextTick, ref } from "vue";
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
	test("renders an inline icon and caches its canonical SVG", async () => {
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
			"https://staging.example.com/v1/avatars/initials/ada-lovelace.svg",
		);
		expect(container.querySelector('[alt="Hello"]')).toHaveAttribute(
			"src",
			"https://preview.example.com/v1/qr-codes.svg?data=aGVsbG8%3D",
		);
	});

	test("renders a QR code without a quiet zone", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(QrCode, {
							value: "https://pictum.dev",
							quietZone: false,
							alt: "Edge-to-edge QR code",
						});
				},
			}),
		);

		expect(
			container.querySelector('[alt="Edge-to-edge QR code"]'),
		).toHaveAttribute(
			"src",
			"https://pictum.dev/api/v1/qr-codes.svg?data=aHR0cHM6Ly9waWN0dW0uZGV2&quiet_zone=0",
		);
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
			"https://pictum.dev/api/v1/avatars/initials/ada-lovelace.webp",
		);

		seed.value = "grace-hopper";
		await nextTick();

		expect(container.textContent).toBe(
			"https://pictum.dev/api/v1/avatars/initials/grace-hopper.webp",
		);
	});

	test("renders gendered realistic avatars", () => {
		const container = mount(
			defineComponent({
				setup() {
					return () =>
						h(Avatar, {
							seed: "customer-123",
							variant: "realistic",
							gender: "male",
							alt: "Customer",
						});
				},
			}),
		);

		expect(container.querySelector('[alt="Customer"]')).toHaveAttribute(
			"src",
			"https://pictum.dev/api/v1/avatars/realistic/male/customer-123.webp",
		);
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
			"https://pictum.dev/api/v1/placeholders/640x360@3x.webp?text=Coming+soon",
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
