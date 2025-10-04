"use client"
 import React, { useState } from 'react';
import { ethers } from 'ethers';

import NftsPage from './Sections/nft';
import Balance from './Sections/balance';
import Transaction from './Sections/Transaction';
export default function Home() {
 

    const [address, setAddress] = useState<string>("")
  return (
  
    <div className='p-10 md:p-15'>

     
    <h1
  className="text-6xl text-white text-center font-bold uppercase tracking-wide"
  style={{
    textShadow: '2px 2px 4px #bbb'
  }}
>
  Tracklet
</h1>
<div className=''>
<p className="text-sm sm:text-3xl text-white text-center p-5 sm:p-20 break-words">
  Paste the wallet address you want to track here... (ETH only)
</p>


<NftsPage setWallet={setAddress} wallet={address}/>
<Balance setWallet={setAddress} wallet={address}/>
 <Transaction setWallet={setAddress} wallet={address}/>
    </div>
    </div>
  );
}

