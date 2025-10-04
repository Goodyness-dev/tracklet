export default function Footer() {
  return (
    <footer className="w-full mt-10 border-t border-gray-700/50 text-gray-300 py-6 px-4 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
        <p className="text-center md:text-left">
         Pilogram © {new Date().getFullYear()} <span className="font-semibold text-white">Tracklet</span>.  
          
        </p>
        <p>All rights reserved</p>

       
      </div>
    </footer>
  );
}
