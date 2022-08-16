const NFTS_QUERY = `{
    items(orderBy:id
      orderDirection:desc
      ){
      id
      name
      description
      image
      price
      seller
    }
  }`;

export default async function fetchNfts() {
  const res = await fetch(
    "https://api.thegraph.com/subgraphs/name/umerarif01/nft-markeplace",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: NFTS_QUERY }),
    }
  );
  const data = await res.json();
  return data;
}
