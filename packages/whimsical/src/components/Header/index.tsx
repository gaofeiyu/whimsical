import logo from '../../assets/logo.svg';
const Header = () => {
  return (
    <div className="flex items-center w-screen h-10 text-lg font-bold border-b">
      <img className="h-9 mx-4" src={logo} />
      Whimsical
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
