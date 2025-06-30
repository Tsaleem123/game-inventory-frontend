import React, { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress, List } from '@mui/material'
import SearchBar from './SearchBar'
import GameListItem from './GameListItem'
import Pager from './Pager'
import { searchGames } from '../api/searchGames'
import type { Game } from '../types/Game'
import type { SearchResponse } from '../api/searchGames'

const pageSize = 10

const GameSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [page, setPage] = useState(1)
  const [results, setResults] = useState<Game[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setResults([])
      setTotal(0)
      return
    }

    const fetch = async () => {
      setLoading(true)
      try {
        const data: SearchResponse = await searchGames(debouncedQuery, page, pageSize)
        setResults(data.results)
        setTotal(data.number_of_total_results)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [debouncedQuery, page])

  return (
    <Box sx={{ maxWidth: 600, minWidth: 600, mt: 2 }}>
      <SearchBar
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setPage(1)
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List sx={{ mt: 2 }}>
            {results.map((game) => (
              <GameListItem key={game.id} game={game} />
            ))}
          </List>

          {results.length > 0 && (
            <Box mt={2} display="flex" justifyContent="center">
              <Pager
                page={page}
                pageCount={Math.ceil(total / pageSize)}
                onChange={(_, p) => setPage(p)}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default GameSearch
