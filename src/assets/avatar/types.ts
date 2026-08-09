import type { AvatarAssetProps } from "pictum";
import type { ImgHTMLAttributes } from "vue";

type NativeImageProps = Omit<ImgHTMLAttributes, "src" | keyof AvatarAssetProps>;

export type AvatarProps = NativeImageProps & AvatarAssetProps;
