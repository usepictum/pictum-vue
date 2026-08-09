import type { PlaceholderOptions } from "pictum";
import { type DefineSetupFnComponent, defineComponent, h } from "vue";
import { usePlaceholder } from "./helper";
import type { PlaceholderProps } from "./types";

export const Placeholder = defineComponent<PlaceholderProps>(
	(props, { attrs }) => {
		const asset = usePlaceholder(
			() =>
				({
					...(props.options ?? {}),
					...(props.size === undefined
						? { width: props.width as number, height: props.height as number }
						: { size: props.size }),
					...(props.format === undefined ? {} : { format: props.format }),
					...(props.density === undefined ? {} : { density: props.density }),
					...(props.background === undefined
						? {}
						: { background: props.background }),
					...(props.color === undefined ? {} : { color: props.color }),
					...(props.text === undefined ? {} : { text: props.text }),
				}) as PlaceholderOptions,
		);

		return () =>
			h("img", {
				...attrs,
				src: asset.value.url,
				width: props.size ?? props.width,
				height: props.size ?? props.height,
			});
	},
	{
		name: "PictumPlaceholder",
		inheritAttrs: false,
		props: [
			"size",
			"width",
			"height",
			"format",
			"density",
			"background",
			"color",
			"text",
			"options",
		],
	},
) as DefineSetupFnComponent<PlaceholderProps>;
