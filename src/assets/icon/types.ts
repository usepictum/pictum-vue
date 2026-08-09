import type { IconAssetProps } from "pictum";
import type { SVGAttributes } from "vue";

type NativeSvgProps = Omit<SVGAttributes, "innerHTML" | keyof IconAssetProps>;

export type IconProps = NativeSvgProps & IconAssetProps;
