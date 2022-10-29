import logo from '../../assets/whimsical-dark.svg';
const Header = () => {
  return (
    <div className="flex items-center w-screen h-10 text-lg font-bold border-b">
      <img className="w-9 h-9 mx-4" src={logo} />
      Whimsical
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
