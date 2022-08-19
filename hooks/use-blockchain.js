import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

function useBlockchain() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState();

  const ContractAddress = "0x6B769B3e27f369491820a6912663c09fEBcDff7B";

  async function load() {
    const p = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(p);
    const addresses = await p.listAccounts();
    if (addresses.length) {
      const s = p.getSigner(addresses[0]);
      setSigner(s);
      const a = await s.getAddress();
      setAddress(a);
      const b = ethers.utils
        .formatEther((await s.getBalance()).toString())
        .substring(0, 6);
      setBalance(b);
      const c = new ethers.Contract(ContractAddress, NFTMarketplace.abi, s);
      setContract(c);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function authProvider() {
    await provider.send("eth_requestAccounts", []);
    const { chainId } = await provider.getNetwork();
    const id = { chainId };
    setNetwork(id);
    const s = provider.getSigner();
    setSigner(s);
    const a = await s.getAddress();
    setAddress(a);
    const b = ethers.utils
      .formatEther((await s.getBalance()).toString())
      .substring(0, 6);
    setBalance(b);
    const c = new ethers.Contract(ContractAddress, NFTMarketplace.abi, s);
    setContract(c);
  }

  return {
    provider,
    signer,
    address,
    balance,
    contract,
    authProvider,
    network,
  };
}

export default useBlockchain;
