import { type PictumAsset, type QrCodeOptions, qrCode } from "pictum";
import {
	type ComputedRef,
	computed,
	type MaybeRefOrGetter,
	toValue,
} from "vue";
import { usePictumOptions } from "../../provider";

export function useQrCode(
	value: MaybeRefOrGetter<string>,
	options?: MaybeRefOrGetter<QrCodeOptions | undefined>,
): ComputedRef<PictumAsset> {
	const pictumOptions = usePictumOptions(options);

	return computed(() =>
		qrCode(toValue(value), {
			...(toValue(options) ?? {}),
			...pictumOptions.value,
		}),
	);
}
