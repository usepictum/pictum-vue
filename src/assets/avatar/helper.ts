import { type AvatarOptions, avatar, type PictumAsset } from "pictum";
import {
	type ComputedRef,
	computed,
	type MaybeRefOrGetter,
	toValue,
} from "vue";
import { usePictumOptions } from "../../provider";

export function useAvatar(
	seed: MaybeRefOrGetter<string>,
	options?: MaybeRefOrGetter<AvatarOptions | undefined>,
): ComputedRef<PictumAsset> {
	const pictumOptions = usePictumOptions(options);

	return computed(() =>
		avatar(toValue(seed), {
			...(toValue(options) ?? {}),
			...pictumOptions.value,
		}),
	);
}
