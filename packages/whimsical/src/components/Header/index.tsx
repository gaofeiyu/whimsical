import React from 'react';
import logo from 'src/assets/logo.svg';

type HeaderProps = {
  children?: React.ReactNode;
};

const Header = (props: HeaderProps) => {
  const { children } = props;
  return (
    <div className="flex flex-shrink-0 flex-grow-0 items-center justify-between w-screen h-10 px-4">
      <div className="flex">
        <img className="h-9 mr-4" src={logo} />
        <span className=" text-lg font-bold border-b">Whimsical</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
