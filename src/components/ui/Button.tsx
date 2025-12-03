import Link from 'next/link';
import React from 'react';

const Button = ({
  text,
  url,
  focused,
}: {
  text: string;
  url: string;
  focused: boolean;
}) => (
  <Link
    href={url}
    className={`${
      focused ? "text-white bg-blue-500" : "text-blue-500 bg-blue-200"
    } font-semibold text-xs md:text-sm px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-md transition-colors duration-200`}
  >
    {text}
  </Link>
);

export default Button;
