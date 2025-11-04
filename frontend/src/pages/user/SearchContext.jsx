import { createContext, useState } from "react"

export const SearchContext = createContext();

function SearchContextFunc({ children }) {
  const [data, setData] = useState(null);

  return (
    <SearchContext.Provider value = {{setData, data}}>
        { children }
    </SearchContext.Provider>
  )
}

export default SearchContextFunc;