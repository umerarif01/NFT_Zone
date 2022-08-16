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
  const router = useRouter();
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
        <img src={image} className="w-[550px] h-[200px] lg:w-[500px] " />
        <div className="p-4">
          <div className="flex flex-col md:flex-col lg:flex-row justify-between ">
            <p style={{ height: "50px" }} className="text-2xl font-semibold">
              {name}
            </p>
            {seller == "0x0000000000000000000000000000000000000000" ? (
              <>
                {" "}
                <p className=" text-md font-semibold">@Owned by you</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">{truncate(seller)}</p>
              </>
            )}
          </div>
          <div style={{ height: "40px", overflow: "hidden" }}>
            <p className="pt-4 text-gray-500">{truncateString(description)}</p>
          </div>
        </div>
        <div className="p-3 ">
          <p className="text-2xl pl-1 font-bold text-black">
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
