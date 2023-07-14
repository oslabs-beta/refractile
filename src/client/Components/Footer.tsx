import React from 'react';

const Footer = (props: any): JSX.Element => {
  return (
    <footer className="fixed left-0 right-0 bottom-0 bg-neutral-200 text-center dark:bg-neutral-700 lg:text-left">
      <div className="p-4 text-center text-neutral-700 dark:text-neutral-200">
        © 2023
        <a className="text-neutral-800 dark:text-neutral-400" href="#">
          ToadOS
        </a>
      </div>
    </footer>
  );
};

export default Footer;
