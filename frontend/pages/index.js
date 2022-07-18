import { NFTCard } from './components/nftCard'
import { useState } from 'react';

export default function Home () {
const [NFTs, setNFTs] = useState([]);

// getData() from API:
async function getData() {
  const response = await fetch('http://localhost:8080/', {mode: "cors"});
  const data = await response.json()

  if(data){
    console.log(data)
    setNFTs(Object.values(data));
    }
}

getData();

return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3 bg-black">
      <div className="flex flex-wrap gap-y-8 mt-4 w-5/6 gap-x-8 justify-center">
      <h1 class="font-medium leading-tight text-5xl mt-0 mb-2 text-lime-300">Degen Devs</h1>
      </div>
      <div className="divide-dashed divide-y divide-yellow-300"></div>

      <div className="flex flex-wrap gap-y-9 mt-6 w-7/8 gap-x-8 justify-center">
          {
            NFTs.length && NFTs.map(nft => {
              return(
                <NFTCard nft={nft}></NFTCard>
              )
            })
          }
      </div>
    </div>
);
}