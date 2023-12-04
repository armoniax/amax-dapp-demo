declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.png";
declare module "*.png";
declare module "*.jpg";
declare module "*.ico";
declare module "@amax/amaxjs";

declare module "*.svg" {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare interface Window {
  scatter: any;
  scatterAMAX: any;
  tinyBrige: any;
  __LINK__: any;
  armadillo: any;
  amaxupClient: any;
}
