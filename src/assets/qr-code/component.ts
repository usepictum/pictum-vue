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
					...(props.quietZone === undefined
						? {}
						: { quietZone: props.quietZone }),
					...(props.foreground === undefined
						? {}
						: { foreground: props.foreground }),
					...(props.background === undefined
						? {}
						: { background: props.background }),
				}) satisfies QrCodeOptions,
		);

		return () => h("img", { ...attrs, src: asset.value.url });
	},
	{
		name: "PictumQrCode",
		inheritAttrs: false,
		props: {
			background: String,
			value: { type: String, required: true },
			format: String as PropType<QrCodeFormat>,
			foreground: String,
			quietZone: { type: Boolean, default: undefined },
			options: Object as PropType<PictumOptions>,
		},
	},
) as DefineSetupFnComponent<QrCodeProps>;
