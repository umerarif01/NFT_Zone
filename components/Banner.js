import React from "react";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <div>
      <div
        className="relative h-[300px] sm:h-[400px] lg:h-[500px] 
        xl:h-[600px] 2xl:h-[700px]"
      >
        <Image src="/bg.jpg" layout="fill" objectFit="cover" priority />
        <div className="absolute top-1/3 w-full text-center">
          <p
            className="text-4xl font-bold text-white md:text-5xl lg:text-7xl pb-5
              "
          >
            A Fully Decentralized NFT MarketPlace
          </p>

          <Link href="/explore">
            <button
              className="text-white bg-black px-10 
              py-4 shadow-md rounded-md font-bold my-3 mr-4
              hover:scale-105
              transition transform duration-200 ease-out"
            >
              Explore
            </button>
          </Link>

          <Link href="create-nft">
            <button
              className="text-black bg-white px-10 
              py-4 shadow-md rounded-md font-bold my-3
              hover:scale-105
              transition transform duration-200 ease-out"
            >
              Create
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
