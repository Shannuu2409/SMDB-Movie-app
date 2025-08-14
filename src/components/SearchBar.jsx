import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchBar = ({ value, onChange, placeholder = "Search movies..." }) => {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
      />
    </div>
  );
};


