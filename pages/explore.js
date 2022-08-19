import React, { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import useBlockchain from "../hooks/use-blockchain";
import { ethers } from "ethers";
import { NFT } from "../components/NFT";
import Head from "next/head";

const Explore = () => {
  const { contract, signer } = useBlockchain();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, [contract]);

  function recentNfts() {
    if (!nfts) return;
    const reversed = [...nfts].reverse();
    setNfts(reversed);
  }

  // price._hex;
  // 0x02c68af0bb140000

  function sortAscending() {
    if (!nfts) return;
    const ascending = [...nfts].sort(function (a, b) {
      return convertHex(a.price._hex) - convertHex(b.price._hex);
    });
    setNfts(ascending);
  }

  function sortDescending() {
    if (!nfts) return;
    const ascending = [...nfts].sort(function (a, b) {
      return convertHex(b.price._hex) - convertHex(a.price._hex);
    });
    setNfts(ascending);
  }

  function convertHex(hex) {
    let hexString = hex.toString(16);
    let price = parseInt(hexString, 16);
    return formatPrice(price);
  }

  function formatPrice(price) {
    if (!price) return;
    let formatedprice = ethers.utils.formatUnits(price.toString(), "ether");
    return formatedprice;
  }

  const loadNFTs = async () => {
    if (!contract) return;
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        console.log(tokenUri);
        const res = await fetch(tokenUri);
        const meta = await res.json();
        let item = {
          price: i.price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          name: meta.name,
          description: meta.description,
          image: meta.image,
        };
        return item;
      })
    );
    console.log(items);
    setNfts(items);
    setLoadingState(true);
  };

  return (
    <div>
      <Head>
        <title>NFT ZONE</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="max-w-7xl mx-auto px-8 sm:px-16">
        <section className="pt-8">
          <h2 className="text-4xl font-semibold pb-3">Explore Marketplace</h2>

          {signer ? (
            <>
              {loadingState ? (
                <>
                  <p className="text-xl font-semibold pb-3 pl-1">
                    {nfts.length} tokens inside
                  </p>
                  <div
                    className="inline-flex mb-5 space-x-3 
                 text-gray-800 whitespace-nowrap"
                  >
                    <p className="button" onClick={recentNfts}>
                      Recent NFTs
                    </p>
                    <p className="button" onClick={sortAscending}>
                      Sort by Lowest Price
                    </p>
                    <p className="button" onClick={sortDescending}>
                      Sort by Highest Price
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                    {nfts?.map((nft) => {
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
                </>
              ) : (
                <p className="text-xl font-semibold pb-3 pl-1">Loading...</p>
              )}
            </>
          ) : (
            <>
              <p className="text-lg font-semibold pb-3">Wallet Not Connected</p>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Explore;
