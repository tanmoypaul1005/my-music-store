import { Suspense } from "react"
import Search from "@/components/search/Search"

export const metadata = {
    title: "Search"
}

const SearchPage = () => <Suspense fallback={null}><Search /></Suspense>

export default SearchPage
