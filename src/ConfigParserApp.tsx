import Image from 'next/image';

// ... existing code ...
<div className="navbar bg-base-100">
  <div className="flex-1">
    <Image
      src="/logo-plain.svg"
      alt="Green-GO Logo"
      width={32}
      height={32}
      className="h-8 mr-2"
    />
    <span className="text-xl">Green-GO Config Parser</span>
  </div>
</div>
// ... existing code ...