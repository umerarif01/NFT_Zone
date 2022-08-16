import axios from "axios";

export async function uploadImagetoIPFS(fileImg) {
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGU5ZTQxYi04MTc1LTQwODEtYjhjNy03ZWI3YTQ5NWMxYzciLCJlbWFpbCI6InVtZXJhcmlmMDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJkMTA2OGM4OGQyMjAwYWU0NWViIiwic2NvcGVkS2V5U2VjcmV0IjoiZTg1NGJjZTc3MmFkYzZkZGUzODM3ZTdhNDhmNTRhNDg4OWVhM2QyMmVjMmQ3YjhkMzU3MWNiZGE3NjA5NGQ0YSIsImlhdCI6MTY2MDI1MDAzOX0.12FCVLNq-HnaqrsGmbXEe-DSjyraPRrUputaEtopvgU";
  try {
    const formData = new FormData();
    formData.append("file", fileImg);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${JWT}`,
      },
    });

    const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
    return imgHash;
  } catch (error) {
    console.log("Error sending File to IPFS: ");
    console.log(error);
  }
}

export async function uploadMetaToIPFS(name, description, config) {
  if (!name | !description | !config) return;
  const res = await axios(config);
  //   console.log(``);
  const nftUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  return nftUrl;
}
