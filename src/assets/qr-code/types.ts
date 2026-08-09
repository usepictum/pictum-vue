import type { QrCodeAssetProps } from "pictum";
import type { ImgHTMLAttributes } from "vue";

type NativeImageProps = Omit<ImgHTMLAttributes, "src" | keyof QrCodeAssetProps>;

export type QrCodeProps = NativeImageProps & QrCodeAssetProps;
