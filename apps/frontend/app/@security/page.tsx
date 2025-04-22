import SearchSecurityTrigger from "./components/search-security/trigger";
import FavoriteList from "./components/favorite-list";

export default function Page() {
  return (
    <aside className="w-[300px] h-full border-l border-gray-200 p-4">
      <SearchSecurityTrigger />
      <FavoriteList />
    </aside>
  );
}
