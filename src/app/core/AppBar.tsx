import { useAppBarActions } from "lib/hooks/useAppBarActions";
import useGetAppBarData from "lib/hooks/useGetAppBarData";
import React from "react";
import { Navbar } from "react-daisyui";
import { MenuIcon } from "ui/icons/MenuIcon";

export interface AppBarProps {
  navMenuHidden: boolean;
  onShowNavMenu: () => void;
  onHideNavMenu: () => void;
  title?: string;
}

export function AppBar({ navMenuHidden, onShowNavMenu, onHideNavMenu, title }: AppBarProps) {
  return (
    <Navbar className="shadow-sm bg-neutral text-neutral-content min-h-[48px]">
      <Navbar.Start>
        <button className="btn btn-square btn-sm mr-1">
          <MenuIcon
            className="cursor-pointer"
            onClick={navMenuHidden ? onShowNavMenu : onHideNavMenu}
            aria-label="Menu"
          />
        </button>
        <span className="text-lg font-bold">{title}</span>
      </Navbar.Start>
    </Navbar>
  );
}

const ConnectedAppBar = ({ title }: { title?: string }) => {
  const config = useGetAppBarData();
  const { toggleNavMenu } = useAppBarActions();

  if (!config) {
    return null;
  }

  return (
    <>
      <AppBar
        title={title}
        navMenuHidden={config.navMenuHidden}
        onShowNavMenu={toggleNavMenu}
        onHideNavMenu={toggleNavMenu}
      />
    </>
  );
};

export default ConnectedAppBar;
