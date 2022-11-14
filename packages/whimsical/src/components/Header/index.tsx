import logo from 'src/assets/logo.svg';
const Header = () => {
  return (
    <div className="flex flex-shrink-0 flex-grow-0 items-center w-screen h-10 text-lg font-bold border-b">
      <img className="h-9 mx-4" src={logo} />
      Whimsical
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
