import { NFTStorage, File } from "nft.storage";
const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVhNzVkODgxZmExMmVlMjk0RGE3ZTllMkVhMkUzMmYxQmQxRjVkMTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDI0NTM0OTE3MiwibmFtZSI6Ik5GVCBaT05FIn0.bmL4N5l0VdNYlCKgmII4s0MUVy9BGTbbvuuRTiakQuc",
});

export async function uploadDataToNFT(name, desc, fileImg) {
  const img = new File([fileImg], "nft.jpg", { type: "image/jpg/png" });
  const metadata = await client.store({
    name: name,
    description: desc,
    image: img,
  });
  const metadataUrl =
    "https://nftstorage.link/ipfs/" + metadata.url.slice(7, 80);
  return metadataUrl;
}
