import { AppProps } from "next/app";
function CustomApp({ Component, pageProps }: AppProps) {
  return (
      <div className="bg-pink-50 h-[300px]">Welcome to diet!</div>
  );
}

export default CustomApp;
