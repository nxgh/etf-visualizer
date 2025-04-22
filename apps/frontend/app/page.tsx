import SearchSecurityTrigger from "./components/search-security/client/trigger";
import FavoriteList from "./components/favorite-list";

export default async function Home() {
  return (
    <div className="w-full h-full flex">
      <aside className="w-[300px] h-full border-l border-gray-200 p-4">
        <SearchSecurityTrigger />
        <FavoriteList />
      </aside>
      <main className="flex-1 p-4">{/* <SearchSecurityList keyword={(searchParams?.sk as string) || ""} /> */}</main>
      <div className="w-[300px] h-full border-l border-gray-200 p-4" />
    </div>
  );
}
