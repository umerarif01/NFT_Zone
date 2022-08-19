import React from "react";
import Image from "next/image";
import { ethers } from "ethers";
import useBlockchain from "../hooks/use-blockchain";
import Link from "next/link";
import { Router, useRouter } from "next/router";

export const NFT = ({
  name,
  description,
  image,
  price,
  seller,
  id,
  show,
  resell,
}) => {
  const { address } = useBlockchain();

  function joinString(_string) {
    return "https://nftstorage.link/ipfs/" + _string.slice(7, 80);
  }

  function truncate(_string) {
    let addr = "@" + _string.slice(0, 7) + "...";
    return addr;
  }

  function truncateString(_string) {
    if (_string.length > 25) return _string.slice(0, 25) + "...";
    else return _string;
  }

  function formatPrice(price) {
    if (!price) return;
    let formatedprice = ethers.utils.formatUnits(price.toString(), "ether");
    return formatedprice;
  }

  return (
    <Link
      href={`/nft/${id}?name=${name}&desc=${description}&img=${image}&seller=${seller}&price=${price}`}
    >
      <div
        key={id}
        className="border shadow-lg rounded-xl overflow-hidden hover:scale-105
    transition transform duration-200 ease-out cursor-pointer"
      >
        <Image
          src={joinString(image)}
          width={550}
          height={450}
          className="lg:w-[500px]"
          priority
          loading="eager"
        />
        <div className="p-4">
          <div className="flex flex-col md:flex-col lg:flex-row justify-between ">
            <p
              style={{ height: "40px" }}
              className=" text-2xl lg:text-2xl font-semibold"
            >
              {name}
            </p>
            {seller == "0x0000000000000000000000000000000000000000" ? (
              <>
                {" "}
                <p className="text-lg lg:text-2xl font-semibold">
                  @Owned by you
                </p>
              </>
            ) : (
              <>
                <p className="text-md lg:text-xl font-semibold">
                  {truncate(seller)}
                </p>
              </>
            )}
          </div>
          <div style={{ height: "25px" }}>
            <p className="text-sm lg:text-lg pt-2 mt-[15px] text-gray-500 font-medium">
              {truncateString(description)}
            </p>
          </div>
        </div>
        <div className="p-3 ">
          <p className="text-lg lg:text-2xl pl-1 font-bold text-black">
            {formatPrice(price)} ETH
          </p>

          {!show ? (
            <>
              {" "}
              {resell ? (
                <>
                  {" "}
                  <button className="mt-4 w-full bg-black text-white font-bold py-2 px-12 rounded  ">
                    Resell
                  </button>
                </>
              ) : (
                <>
                  {" "}
                  <button className="mt-4 w-full bg-black text-white font-bold py-2 px-12 rounded">
                    Buy
                  </button>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  );
};
