"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };

  return (
    <form
      className="flex w-full justify-center"
      onSubmit={searchProducts}
      suppressHydrationWarning={true} // giúp tránh cảnh báo SSR mismatch
    >
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Type here"
        className="bg-gray-50 input input-bordered w-full md:w-[70%] rounded-r-none outline-none focus:outline-none"
      />
      <button
        type="submit"
        className="btn bg-pink-500 text-white rounded-l-none rounded-r-xl hover:bg-pink-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
