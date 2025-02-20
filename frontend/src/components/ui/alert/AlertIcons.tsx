import { SVGProps } from 'react';

export const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={50}
    height={50}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25C50 31.6304 47.3661 37.9893 42.6777 42.6777C37.9893 47.3661 31.6304 50 25 50C18.3696 50 12.0107 47.3661 7.32233 42.6777C2.63392 37.9893 0 31.6304 0 25C0 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0ZM21.8857 29.9321L16.3321 24.375C16.133 24.1759 15.8967 24.018 15.6366 23.9102C15.3764 23.8025 15.0976 23.747 14.8161 23.747C14.5345 23.747 14.2557 23.8025 13.9956 23.9102C13.7355 24.018 13.4991 24.1759 13.3 24.375C12.8979 24.7771 12.672 25.3224 12.672 25.8911C12.672 26.4597 12.8979 27.0051 13.3 27.4071L20.3714 34.4786C20.57 34.6787 20.8061 34.8375 21.0663 34.9459C21.3265 35.0543 21.6056 35.1101 21.8875 35.1101C22.1694 35.1101 22.4485 35.0543 22.7087 34.9459C22.9689 34.8375 23.205 34.6787 23.4036 34.4786L38.0464 19.8321C38.2482 19.6339 38.4087 19.3976 38.5187 19.137C38.6287 18.8764 38.686 18.5966 38.6873 18.3137C38.6886 18.0309 38.6339 17.7505 38.5263 17.4889C38.4188 17.2273 38.2605 16.9896 38.0606 16.7894C37.8607 16.5893 37.6231 16.4307 37.3616 16.3228C37.1001 16.215 36.8199 16.1599 36.537 16.1609C36.2541 16.1619 35.9743 16.2189 35.7135 16.3286C35.4528 16.4383 35.2164 16.5985 35.0179 16.8L21.8857 29.9321Z"
      fill="white"
    />
  </svg>
);

export const ErrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={50}
    height={50}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M25 37.5C25.7083 37.5 26.3025 37.26 26.7825 36.78C27.2625 36.3 27.5017 35.7066 27.5 35C27.4983 34.2933 27.2583 33.7 26.78 33.22C26.3017 32.74 25.7083 32.5 25 32.5C24.2917 32.5 23.6983 32.74 23.22 33.22C22.7417 33.7 22.5017 34.2933 22.5 35C22.4983 35.7066 22.7383 36.3008 23.22 36.7825C23.7017 37.2641 24.295 37.5033 25 37.5ZM22.5 27.5H27.5V12.5H22.5V27.5ZM25 50C21.5417 50 18.2917 49.3433 15.25 48.03C12.2083 46.7166 9.5625 44.9358 7.3125 42.6875C5.0625 40.4391 3.28167 37.7933 1.97 34.75C0.658336 31.7066 0.00166983 28.4566 3.16455e-06 25C-0.0016635 21.5433 0.655003 18.2933 1.97 15.25C3.285 12.2067 5.06583 9.56083 7.3125 7.3125C9.55916 5.06416 12.205 3.28333 15.25 1.97C18.295 0.656666 21.545 0 25 0C28.455 0 31.705 0.656666 34.75 1.97C37.795 3.28333 40.4408 5.06416 42.6875 7.3125C44.9341 9.56083 46.7158 12.2067 48.0325 15.25C49.3491 18.2933 50.005 21.5433 50 25C49.995 28.4566 49.3383 31.7066 48.03 34.75C46.7216 37.7933 44.9408 40.4391 42.6875 42.6875C40.4341 44.9358 37.7883 46.7175 34.75 48.0325C31.7116 49.3475 28.4617 50.0033 25 50Z"
      fill="white"
    />
  </svg>
);

export const WarningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={50}
    height={44}
    viewBox="0 0 50 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 43.1818L25 0L50 43.1818H0ZM25 36.3636C25.6439 36.3636 26.1841 36.1455 26.6205 35.7091C27.0568 35.2727 27.2742 34.7333 27.2727 34.0909C27.2712 33.4485 27.053 32.9091 26.6182 32.4727C26.1833 32.0364 25.6439 31.8182 25 31.8182C24.3561 31.8182 23.8167 32.0364 23.3818 32.4727C22.947 32.9091 22.7288 33.4485 22.7273 34.0909C22.7258 34.7333 22.9439 35.2735 23.3818 35.7114C23.8197 36.1492 24.3591 36.3667 25 36.3636ZM22.7273 29.5455H27.2727V18.1818H22.7273V29.5455Z"
      fill="white"
    />
  </svg>
);

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={50}
    height={50}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.5 37.5H27.5V22.5H22.5V37.5ZM25 17.5C25.7083 17.5 26.3025 17.26 26.7825 16.78C27.2625 16.3 27.5017 15.7067 27.5 15C27.4983 14.2933 27.2583 13.7 26.78 13.22C26.3017 12.74 25.7083 12.5 25 12.5C24.2917 12.5 23.6983 12.74 23.22 13.22C22.7417 13.7 22.5017 14.2933 22.5 15C22.4983 15.7067 22.7383 16.3008 23.22 16.7825C23.7017 17.2642 24.295 17.5033 25 17.5ZM25 50C21.5417 50 18.2917 49.3433 15.25 48.03C12.2083 46.7166 9.5625 44.9358 7.3125 42.6875C5.0625 40.4391 3.28167 37.7933 1.97 34.75C0.658336 31.7066 0.00166983 28.4566 3.16455e-06 25C-0.0016635 21.5433 0.655003 18.2933 1.97 15.25C3.285 12.2067 5.06583 9.56083 7.3125 7.3125C9.55916 5.06416 12.205 3.28333 15.25 1.97C18.295 0.656666 21.545 0 25 0C28.455 0 31.705 0.656666 34.75 1.97C37.795 3.28333 40.4408 5.06416 42.6875 7.3125C44.9341 9.56083 46.7158 12.2067 48.0325 15.25C49.3491 18.2933 50.005 21.5433 50 25C49.995 28.4566 49.3383 31.7066 48.03 34.75C46.7216 37.7933 44.9408 40.4391 42.6875 42.6875C40.4341 44.9358 37.7883 46.7175 34.75 48.0325C31.7116 49.3475 28.4617 50.0033 25 50Z"
      fill="white"
    />
  </svg>
);
