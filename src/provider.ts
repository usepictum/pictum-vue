import type { PictumOptions } from "pictum";
import {
	type ComputedRef,
	computed,
	defineComponent,
	type InjectionKey,
	inject,
	type MaybeRefOrGetter,
	type PropType,
	provide,
	toValue,
} from "vue";

export const pictumOptionsKey: InjectionKey<ComputedRef<PictumOptions>> =
	Symbol("PictumOptions");
const defaultOptions = computed<PictumOptions>(() => ({}));

export interface PictumProviderProps {
	options?: PictumOptions;
}

export const PictumProvider = defineComponent({
	name: "PictumProvider",
	props: {
		options: Object as PropType<PictumOptions>,
	},
	setup(props, { slots }) {
		const inherited = inject(pictumOptionsKey, defaultOptions);
		const value = computed(() =>
			mergePictumOptions(inherited.value, props.options),
		);
		provide(pictumOptionsKey, value);

		// biome-ignore lint/complexity/useLiteralKeys: Strict TypeScript requires indexed access for Slots.
		return () => slots["default"]?.();
	},
});

export function usePictumOptions(
	options?: MaybeRefOrGetter<PictumOptions | undefined>,
): ComputedRef<PictumOptions> {
	const inherited = inject(pictumOptionsKey, defaultOptions);
	return computed(() => mergePictumOptions(inherited.value, toValue(options)));
}

function mergePictumOptions(
	inherited: PictumOptions,
	overrides?: PictumOptions,
): PictumOptions {
	const baseUrl = overrides?.baseUrl ?? inherited.baseUrl;
	return baseUrl === undefined ? {} : { baseUrl };
}
