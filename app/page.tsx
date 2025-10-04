"use client"
 import React, { useEffect, useState,useRef } from 'react';
import gsap from 'gsap';


import NftsPage from './Sections/nft';
import Balance from './Sections/balance';
import Transaction from './Sections/Transaction';
import Footer from './Sections/Footer';
export default function Home() {
      const [address, setAddress] = useState<string>("")
      const pageText = useRef<HTMLParagraphElement>(null)
        const h1Ref = useRef<HTMLHeadingElement>(null);


 useEffect(()=> {
  gsap.from(pageText.current, {
   y: -200,
   yoyo:true,
   ease: "power1.inOut",
   duration: 0.7
  })

      if (!h1Ref.current) return;

    const text = h1Ref.current.textContent || "";
    h1Ref.current.textContent = ""; // start empty

    let index = 0;

    const type = () => {
      if (!h1Ref.current) return;

      h1Ref.current.textContent += text[index];
      index += 1;

 

      if (index < text.length) {
        gsap.delayedCall(0.1, type); // typing speed
      }
    };

    type();
  
 },[])



  return (
  
    <div className='p-10 md:p-15'>

     
    <h1
    ref={h1Ref}
  className="text-6xl text-white text-center font-bold uppercase tracking-wide"
  style={{
    textShadow: '2px 2px 4px #bbb'
  }}
>
  Tracklet
</h1>
<div className=''>
<p  ref={pageText} className="text-sm sm:text-3xl text-white text-center p-5 sm:p-20 break-words">
  Paste the wallet address you want to track here... (ETH only)
</p>


<NftsPage setWallet={setAddress} wallet={address}/>
<Balance setWallet={setAddress} wallet={address}/>
 <Transaction setWallet={setAddress} wallet={address}/>
 <Footer/>
    </div>
    </div>
  );
}

