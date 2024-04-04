import React from "react";
import images from "../constants/images";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary shadow font-primary">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="#"
            className="mx-auto sm:mx-0 flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse w-fit"
          >
            <img src={images.logo_w} alt="E-learning Logo" />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-md text-white sm:mb-0">
            <li>
              <a
                href="https://www.esi-sba.dz/fr/"
                className="hover:underline me-4 md:me-6"
              >
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className=" hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="mailto:contact@esi-sba.dz" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-secondary2 sm:mx-auto  lg:my-8" />
        <span className="block text-sm text-secondary1 sm:text-center ">
          © {currentYear}{" "}
          <a href="#" className="hover:underline">
            E-learning ESI SBA
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
