import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NavBar } from "../../components/NavBar";
import Image from "next/image";
import { ethers } from "ethers";
import useBlockchain from "../../hooks/use-blockchain";
import { toast, ToastContainer } from "react-toastify";
import fetchNfts from "../../utils/fetchNfts";
import "react-toastify/dist/ReactToastify.css";
import { NFT } from "../../components/NFT";

const NFTPage = () => {
  const router = useRouter();
  const { contract, signer, address } = useBlockchain();
  const [nfts, SetNfts] = useState([]);
  const { name, id, img, desc, seller, price } = router.query;

  function joinString(_string) {
    return "https://nftstorage.link/ipfs/" + _string.slice(7, 80);
  }

  function formatPrice(price) {
    if (!price) return;
    let formatedprice = ethers.utils.formatUnits(price.toString(), "ether");
    return formatedprice;
  }

  async function buyNft(tokenId) {
    if (!signer) {
      toast.error("Connect Wallet");
      return;
    }
    if (!contract) return;
    const formatedPrice = formatPrice(price);
    if (formatedPrice) {
      const price = ethers.utils.parseUnits(formatedPrice.toString(), "ether");
      const transaction = await contract.createMarketSale(tokenId.toString(), {
        value: price,
      });
      await transaction.wait();
    }
  }

  async function moreNfts() {
    const data = await fetchNfts();
    const meta = data.data.items;
    SetNfts(meta);
  }

  useEffect(() => {
    moreNfts();
  }, []);

  return (
    <div>
      <NavBar />

      <main className="max-w-7xl mx-auto px-8 sm:px-16">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
        />
        <section className="pt-8">
          <h2 className="text-4xl font-semibold pb-4">
            {name} - # {id}
          </h2>

          <div className="flex flex-col space-y-3 md:flex-row space-x-10 ">
            <img
              src={joinString(img)}
              className="h-[308px] rounded-md"
              width="300"
              height="300"
            />

            <div className="flex flex-col lg:w-1/2">
              <h2 className="text-2xl font-medium pb-1">Description:</h2>
              <h1 className="text-xl font-normal p-5 border-2 rounded-md border-gray-300 truncate">
                {desc}
              </h1>
              <h1 className="text-2xl font-medium pt-1 pb-2 ">Owned by: </h1>

              {seller === address ? (
                <>
                  <h1 className="text-md font-normal p-5 border-2 rounded-md border-gray-300 md:text-xl">
                    You
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-md font-normal p-5 border-2 rounded-md border-gray-300 md:text-xl">
                    {seller}
                  </h1>
                </>
              )}

              <button
                className="font-bold mt-4  bg-black text-white rounded p-4 shadow-lg "
                onClick={() => buyNft(id)}
              >
                Buy for {formatPrice(price)} ETH
              </button>
            </div>
          </div>
        </section>
        <section className="pt-8">
          <h2 className="text-4xl font-semibold pb-4">More NFTs Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {nfts
              ?.filter((nft) => {
                if (name == "") {
                  return nft;
                } else if (nft.name.toLowerCase() !== name.toLowerCase()) {
                  return nft;
                }
              })
              .map((nft) => {
                return (
                  <NFT
                    key={nft.tokenId}
                    id={nft.tokenId}
                    name={nft.name}
                    description={nft.description}
                    image={nft.image}
                    price={nft.price}
                    seller={nft.seller}
                    show={false}
                  />
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default NFTPage;
