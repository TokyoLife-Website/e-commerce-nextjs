import { SVGProps } from 'react';
import CartIcon from '../../../public/cart.svg';
import BagIcon from '../../../public/bag.svg';
import MapIcon from '../../../public/map.svg';
import MoneyBagIcon from '../../../public/money_bag.svg';
import ReturnIcon from '../../../public/return.svg';
import FreeShippingIcon from '../../../public/free_shipping.svg';
import FacebookIcon from '../../../public/facebook.svg';
import TikTokIcon from '../../../public/tiktok.svg';
import YoutubeIcon from '../../../public/youtube.svg';
import ZaloIcon from '../../../public/zalo.svg';
import GlobeIcon from '../../../public/globe.svg';
import FileIcon from '../../../public/file.svg';
import FlowerIcon from '../../../public/flower.svg';
import WindowIcon from '../../../public/window.svg';
import NextIcon from '../../../public/next.svg';
import VnpayIcon from '../../../public/vnpay.svg';
import CodIcon from '../../../public/cod.svg';
import AppStoreIcon from '../../../public/app_store.svg';
import GooglePlayIcon from '../../../public/google_play.svg';

export type IconName =
  | 'cart'
  | 'bag'
  | 'map'
  | 'moneyBag'
  | 'return'
  | 'freeShipping'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'zalo'
  | 'globe'
  | 'file'
  | 'flower'
  | 'window'
  | 'next'
  | 'vnpay'
  | 'cod'
  | 'appStore'
  | 'googlePlay';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

const iconComponents = {
  cart: CartIcon,
  bag: BagIcon,
  map: MapIcon,
  moneyBag: MoneyBagIcon,
  return: ReturnIcon,
  freeShipping: FreeShippingIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  youtube: YoutubeIcon,
  zalo: ZaloIcon,
  globe: GlobeIcon,
  file: FileIcon,
  flower: FlowerIcon,
  window: WindowIcon,
  next: NextIcon,
  vnpay: VnpayIcon,
  cod: CodIcon,
  appStore: AppStoreIcon,
  googlePlay: GooglePlayIcon,
};

export const Icon = ({ name, size = 24, width, height, className, ...props }: IconProps) => {
  const IconComponent = iconComponents[name];
  return (
    <div className={className} style={{ width: width || size, height: height || size }}>
      <IconComponent width="100%" height="100%" {...props} />
    </div>
  );
}; 