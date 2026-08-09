import { type PictumAsset, type PlaceholderOptions, placeholder } from "pictum";
import {
	type ComputedRef,
	computed,
	type MaybeRefOrGetter,
	toValue,
} from "vue";
import { usePictumOptions } from "../../provider";

export function usePlaceholder(
	options: MaybeRefOrGetter<PlaceholderOptions>,
): ComputedRef<PictumAsset> {
	const pictumOptions = usePictumOptions(options);

	return computed(() =>
		placeholder({
			...toValue(options),
			...pictumOptions.value,
		} as PlaceholderOptions),
	);
}
