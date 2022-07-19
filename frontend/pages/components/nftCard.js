import React from "react";

export const NFTCard = ({nft}) => {

    return (
        <div className="w-1/4 flex flex-col" key={nft.tokenID}>
            <div className="rounded-md" >
                <img className="object-cover h-140 w-140 rounded-t-md"
                src={nft.image}></img>
            </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 h-110" >
                <div className="" >
                    <h2 className="text-xl text-black-800 font-bold" >{nft.description}</h2>
                    <p className="text-black-800" >Token ID: {nft.tokenID}</p>
                    <div class="flex flex-col justify-center px-4 pb-1">
                        <p className="text-lime-500 y-gap-4 font-bold text-center" >Metadata:</p>
                        <span class="bg-gray-200 rounded-full px-3 py-1 text-sm text-black-200 mr-2 mb-2">Hoodie Color: {nft.attributes[0].value}</span>
                        <span class="bg-gray-200 rounded-full px-3 py-1 text-sm text-black-200 mr-2 mb-2">Hat Number Color: {nft.attributes[1].value}</span>
                        <span class="bg-gray-200 rounded-full px-3 py-1 text-sm text-black-200 mr-2 mb-2">Operation System: {nft.attributes[2].value}</span>
                        <span class="bg-gray-200 rounded-full px-3 py-1 text-sm text-black-200 mr-2 mb-2">Dev Skin Tone: {nft.attributes[3].value}</span>
                    </div>
                </div>
                <div className="flex flex-row justify-center py-1">
                    <button class="bg-lime-100 hover:bg-black text-black-100 font-semibold hover:text-white py-2 px-4 border border-black  hover:border-transparent rounded mr-3 mb-2">
                        Buy
                    </button>
                    <button class="bg-lime-100 hover:bg-black text-black-100 font-semibold hover:text-white py-2 px-4 border border-black  hover:border-transparent rounded mr-3 mb-2">
                        Transfer 
                    </button>
                    <button class="bg-lime-100 hover:bg-black text-black-100 font-semibold hover:text-white py-2 px-4 border border-black  hover:border-transparent rounded mr-2 mb-2">
                        Allow
                    </button>
                </div>
            </div>
        </div> 
    ) 
}