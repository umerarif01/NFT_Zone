import React, { useState, useEffect } from "react";
import { NavBar } from "../components/NavBar";
import { NFT } from "../components/NFT";
import useBlockchain from "../hooks/use-blockchain";
import Head from "next/head";
import MyNfts from "../components/MyNfts";

const MYNFTs = () => {
  const { contract, signer } = useBlockchain();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, [contract]);

  const loadNFTs = async () => {
    if (!contract) return;

    const data = await contract.fetchItemsListed();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
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
          <h2 className="text-4xl font-semibold pb-3">{" My Listed NFT's "}</h2>
          {signer ? (
            <>
              {loadingState ? (
                <>
                  <p className="text-xl font-semibold pb-3 pl-1">
                    {nfts.length} tokens
                  </p>

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
                          show={true}
                        />
                      );
                    })}
                  </div>
                  <section className="pt-8">
                    <MyNfts />
                  </section>
                </>
              ) : (
                <p className="text-xl font-semibold pb-3 pl-1">Loading...</p>
              )}
            </>
          ) : (
            <>
              <p className="text-lg font-semibold pb-3 ">
                Wallet Not Connected
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default MYNFTs;
