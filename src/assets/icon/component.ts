import type { PictumAsset, PictumOptions } from "pictum";
import {
	type DefineSetupFnComponent,
	defineComponent,
	h,
	type PropType,
	shallowRef,
	watch,
} from "vue";
import { useIcon } from "./helper";
import type { IconProps } from "./types";

interface ParsedIcon {
	body: string;
	viewBox: string;
}

const iconCache = new Map<string, Promise<ParsedIcon>>();

export const Icon = defineComponent<IconProps>(
	(props, { attrs }) => {
		const asset = useIcon(
			() => props.name,
			() => props.options,
		);
		const markup = shallowRef<ParsedIcon>();

		watch(
			asset,
			async (nextAsset, _, onCleanup) => {
				let active = true;
				onCleanup(() => {
					active = false;
				});
				markup.value = undefined;

				const nextMarkup = await loadIcon(nextAsset);
				if (active) {
					markup.value = nextMarkup;
				}
			},
			{ immediate: true },
		);

		return () =>
			h("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: markup.value?.viewBox,
				...attrs,
				innerHTML: markup.value?.body,
			});
	},
	{
		name: "PictumIcon",
		inheritAttrs: false,
		props: {
			name: { type: String, required: true },
			options: Object as PropType<PictumOptions>,
		},
	},
) as DefineSetupFnComponent<IconProps>;

function loadIcon(asset: PictumAsset): Promise<ParsedIcon> {
	const cached = iconCache.get(asset.url);
	if (cached !== undefined) {
		return cached;
	}

	const request = asset.svg().then(parseIcon);
	iconCache.set(asset.url, request);
	void request.catch(() => {
		if (iconCache.get(asset.url) === request) {
			iconCache.delete(asset.url);
		}
	});

	return request;
}

function parseIcon(svg: string): ParsedIcon {
	const root = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i.exec(svg);
	const attributes = root?.[1];
	const body = root?.[2];
	const viewBox =
		attributes === undefined
			? undefined
			: /\bviewBox\s*=\s*(["'])(.*?)\1/i.exec(attributes)?.[2];

	if (body === undefined || viewBox === undefined) {
		throw new Error("Pictum returned invalid icon SVG markup.");
	}

	return { body, viewBox };
}
