import type { PictumOptions, QrCodeFormat, QrCodeOptions } from "pictum";
import {
	type DefineSetupFnComponent,
	defineComponent,
	h,
	type PropType,
} from "vue";
import { useQrCode } from "./helper";
import type { QrCodeProps } from "./types";

export const QrCode = defineComponent<QrCodeProps>(
	(props, { attrs }) => {
		const asset = useQrCode(
			() => props.value,
			() =>
				({
					...(props.options ?? {}),
					...(props.format === undefined ? {} : { format: props.format }),
				}) satisfies QrCodeOptions,
		);

		return () => h("img", { ...attrs, src: asset.value.url });
	},
	{
		name: "PictumQrCode",
		inheritAttrs: false,
		props: {
			value: { type: String, required: true },
			format: String as PropType<QrCodeFormat>,
			options: Object as PropType<PictumOptions>,
		},
	},
) as DefineSetupFnComponent<QrCodeProps>;
