// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-100 shadow-md text-center py-4 mt-auto">
      <p className="text-black text-sm">
        © {new Date().getFullYear()} My Company. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
