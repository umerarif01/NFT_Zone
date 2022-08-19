import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SearchIcon, UsersIcon } from "@heroicons/react/solid";
import useBlockchain from "../hooks/use-blockchain";
import { useRouter } from "next/router";
import fetchNfts from "../utils/fetchNfts";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

export const NavBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const { authProvider, signer, address } = useBlockchain();
  const router = useRouter();
  const [nfts, SetNfts] = useState([]);

  async function moreNfts() {
    const data = await fetchNfts();
    const meta = data.data.items;
    SetNfts(meta);
  }

  useEffect(() => {
    moreNfts();
    checkNetwork();
  }, []);

  async function checkNetwork() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const { chainId } = await provider.getNetwork();
    if (chainId != 5) toast.error("Please Connect to Goerli Network");
  }

  return (
    <header
      className="sticky top-0 z-50 grid grid-cols-3 
  bg-white  p-5 md:px-10"
    >
      {/* left */}
      <div className="relative flex items-center h-10  my-auto">
        <Image
          width={200}
          height={80}
          src="/logo.jpg"
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      {/* Middle */}
      <div className="flex items-center  md:border-2 rounded-full py-3 md:shadow-sm">
        <input
          //   value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder={"Search NFTs here"}
          className="flex-grow pl-1 lg:pl-5 bg-transparent outline-none 
        text-sm text-gray-600 placeholder-gray-400"
        />
        <SearchIcon
          className="hidden md:inline-flex h-8 bg-black
        text-white rounded-full 
         p-2 cursor-pointer md:mx-2"
        />
      </div>
      {/* Right */}

      <div className="flex items-center space-x-5 justify-end   ">
        <div className="hidden lg:flex space-x-4 ">
          <p
            className="inline cursor-pointer font-semibold hover:text-gray-500"
            onClick={() => router.push("/explore")}
          >
            Explore
          </p>
          <p
            className="inline cursor-pointer font-semibold hover:text-gray-500"
            onClick={() => router.push("/create-nft")}
          >
            Create NFTs
          </p>
          <p
            className="inline cursor-pointer font-semibold hover:text-gray-500"
            onClick={() => {
              // if (!signer) {
              //   alert("Connect Wallet First");
              //   return;
              // }
              router.push("/my-nfts");
            }}
          >
            My NFTs
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          {signer ? (
            <>
              <button
                className="bg-black px-4 py-2 text-white text-sm font-semibold rounded-full  hover:scale-105
          transition transform duration-200 ease-out"
                onClick={authProvider}
              >
                {address?.substring(0, 10)}...
              </button>
            </>
          ) : (
            <button
              className="bg-black px-4 py-2 text-white text-sm font-semibold rounded-full  hover:scale-105
            transition transform duration-200 ease-out"
              onClick={() => {
                authProvider();
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />

      {searchInput && (
        <div className="flex flex-col col-span-3 mx-auto mt-2">
          {nfts
            ?.filter((nft) => {
              if (searchInput == "") {
                return nft;
              } else if (
                nft.name.toLowerCase().includes(searchInput.toLowerCase())
              ) {
                return nft;
              }
            })
            .map((nft) => {
              return (
                <Link
                  href={`/nft/${nft.id}?name=${nft.name}&desc=${nft.description}&img=${nft.image}&seller=${nft.seller}&price=${nft.price}`}
                  key={nft.id}
                >
                  <div className="flex items-center px-[100px] py-3 space-x-[50px] rounded-md cursor-pointer hover:bg-gray-200 transition ease-in">
                    <img
                      className="rounded-md h-[50px]"
                      src={nft.image}
                      width="50px"
                      height="50px"
                    />
                    <div className="flex flex-col">
                      {" "}
                      <p className="text-xl font-medium">{nft.name}</p>
                      <p className="text-xs font-medium">{nft.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </header>
  );
};
