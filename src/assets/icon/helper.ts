import { type IconOptions, icon, type PictumAsset } from "pictum";
import {
	type ComputedRef,
	computed,
	type MaybeRefOrGetter,
	toValue,
} from "vue";
import { usePictumOptions } from "../../provider";

export function useIcon(
	name: MaybeRefOrGetter<string>,
	options?: MaybeRefOrGetter<IconOptions | undefined>,
): ComputedRef<PictumAsset> {
	const pictumOptions = usePictumOptions(options);
	return computed(() => icon(toValue(name), pictumOptions.value));
}
