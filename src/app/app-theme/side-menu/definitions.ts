export type MenuItem = ParentMenuItem | SubMenuItem;

export interface ParentMenuItem {
  title: string;
  icon?: string;
  children?: SubMenuItem[];
  minTapVersion?: string;
}

export interface SubMenuItem {
  title: string;
  url: string;
  icon: string;
  minTapVersion?: string;
}
