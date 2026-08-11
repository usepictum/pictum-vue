import type {
	AvatarFormat,
	AvatarGender,
	AvatarOptions,
	AvatarVariant,
	PictumOptions,
} from "pictum";
import {
	type DefineSetupFnComponent,
	defineComponent,
	h,
	type PropType,
} from "vue";
import { useAvatar } from "./helper";
import type { AvatarProps } from "./types";

interface AvatarRuntimeProps {
	seed: string;
	variant?: AvatarVariant;
	gender?: AvatarGender;
	format?: AvatarFormat;
	size?: number;
	options?: PictumOptions;
}

export const Avatar = defineComponent<AvatarRuntimeProps>(
	(props, { attrs }) => {
		const asset = useAvatar(
			() => props.seed,
			() =>
				({
					...(props.options ?? {}),
					...(props.variant === undefined ? {} : { variant: props.variant }),
					...(props.gender === undefined ? {} : { gender: props.gender }),
					...(props.format === undefined ? {} : { format: props.format }),
					...(props.size === undefined ? {} : { size: props.size }),
				}) as AvatarOptions,
		);

		return () => h("img", { ...attrs, src: asset.value.url });
	},
	{
		name: "PictumAvatar",
		inheritAttrs: false,
		props: {
			seed: { type: String, required: true },
			variant: String as PropType<AvatarVariant>,
			gender: String as PropType<AvatarGender>,
			format: String as PropType<AvatarFormat>,
			size: Number,
			options: Object as PropType<PictumOptions>,
		},
	},
) as unknown as DefineSetupFnComponent<AvatarProps>;
