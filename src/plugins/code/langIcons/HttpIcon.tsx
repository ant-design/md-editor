import React from 'react';

interface HttpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HttpIcon: React.FC<HttpIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.047 13.856c.074-.613.13-1.225.13-1.856s-.056-1.244-.13-1.856h3.137c.148.594.241 1.215.241 1.856a7.65 7.65 0 0 1-.241 1.856m-4.78 5.16c.557-1.03.984-2.144 1.281-3.304h2.738a7.452 7.452 0 0 1-4.019 3.304m-.232-5.16H9.83c-.093-.613-.149-1.225-.149-1.856s.056-1.253.149-1.856h4.343c.084.603.149 1.225.149 1.856s-.065 1.243-.149 1.856m-2.171 5.531c-.77-1.113-1.393-2.348-1.773-3.675h3.545c-.38 1.327-1.002 2.562-1.773 3.675m-3.712-11.1h-2.71a7.353 7.353 0 0 1 4.01-3.304c-.557 1.03-.975 2.144-1.3 3.304m-2.71 7.425h2.71c.325 1.16.743 2.274 1.3 3.304a7.433 7.433 0 0 1-4.01-3.304m-.761-1.856A7.65 7.65 0 0 1 4.576 12c0-.64.093-1.263.241-1.857h3.137c-.074.613-.13 1.226-.13 1.857s.056 1.243.13 1.856M12 4.603c.77 1.113 1.393 2.357 1.773 3.684h-3.545c.38-1.327 1.002-2.57 1.773-3.684m6.422 3.684h-2.738a14.523 14.523 0 0 0-1.28-3.304 7.412 7.412 0 0 1 4.018 3.304M12 2.72c-5.132 0-9.28 4.176-9.28 9.28A9.28 9.28 0 0 0 12 21.282 9.28 9.28 0 0 0 21.281 12a9.28 9.28 0 0 0-9.28-9.281z"
        fill="#e53935"
      />
    </svg>
  );
};

export default HttpIcon;
