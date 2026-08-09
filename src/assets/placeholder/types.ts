import type { PlaceholderAssetProps } from "pictum";
import type { ImgHTMLAttributes } from "vue";

type PlaceholderImageProps = Omit<
	ImgHTMLAttributes,
	"color" | "height" | "src" | "width" | keyof PlaceholderAssetProps
>;

export type PlaceholderProps = PlaceholderImageProps & PlaceholderAssetProps;
