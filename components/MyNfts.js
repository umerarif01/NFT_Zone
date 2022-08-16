import React, { useState, useEffect } from "react";
import useBlockchain from "../hooks/use-blockchain";
import NFTv2 from "./NFTv2";

const MyNfts = () => {
  const { contract } = useBlockchain();
  const [nfts, setNfts] = useState([]);
  const [state, SetState] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, [contract]);

  const loadNFTs = async () => {
    if (!contract) return;

    const data = await contract.fetchMyNFTs();
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
    SetState(true);
  };

  return (
    <div>
      <h2 className="text-4xl font-semibold pb-3">{" My NFT's "}</h2>
      {state ? (
        <>
          {" "}
          <p className="text-xl font-semibold pb-3 pl-1">
            {nfts.length} tokens
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {nfts?.map((nft) => {
              return (
                <NFTv2
                  key={nft.tokenId}
                  id={nft.tokenId}
                  name={nft.name}
                  description={nft.description}
                  image={nft.image}
                  price={nft.price}
                  seller={nft.seller}
                  show={false}
                  resell={true}
                />
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="text-xl font-semibold pb-3 pl-1"> Loading</p>
        </>
      )}
    </div>
  );
};

export default MyNfts;
