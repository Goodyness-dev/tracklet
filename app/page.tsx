"use client"
 import React, { useState } from 'react';
import { ethers } from 'ethers';
import NftsContainer from './Components/connect';
import NftsPage from './Sections/nft';
import Balance from './Sections/balance';
import Transaction from './Sections/Transaction';
export default function Home() {
 
    const [provider, setProvider] = useState<ethers.BrowserProvider| null>(null)
    const [address, setAddress] = useState<string>("")
  return (
  
    <div className='p-10'>

     
    <h1
  className="text-6xl text-white text-center font-bold uppercase tracking-wide"
  style={{
    textShadow: '2px 2px 4px #bbb'
  }}
>
  Tracklet
</h1>
<div className=''>
  <p className='flex justify-center items-center text-3xl text-white p-20'>Paste the wallet address you want to track here...(eth only)</p>

<NftsPage setWallet={setAddress} wallet={address}/>
<Balance setWallet={setAddress} wallet={address}/>
 <Transaction setWallet={setAddress} wallet={address}/>
    </div>
    </div>
  );
}

