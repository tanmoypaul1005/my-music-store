"use client"
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import styles from './HeaderSearch.module.scss'

const HeaderSearch = () => {
    const router = useRouter()
    const pathname = usePathname()
    const urlQuery = useSearchParams().get('q') || ''
    const onSearchPage = pathname === '/search'

    const [value, setValue] = useState(onSearchPage ? urlQuery : '')
    const inputRef = useRef<HTMLInputElement>(null)
    const timer = useRef<ReturnType<typeof setTimeout>>()

    // Keep the box in sync when the URL changes (back/forward) and clear it when leaving search
    useEffect(() => {
        setValue(onSearchPage ? urlQuery : '')
    }, [onSearchPage, urlQuery])

    // Sidebar "Search" link focuses the box
    useEffect(() => {
        if (onSearchPage) inputRef.current?.focus()
    }, [onSearchPage])

    const go = (text: string) => {
        const q = text.trim()
        const url = q ? `/search?q=${encodeURIComponent(q)}` : '/search'
        if (onSearchPage) router.replace(url)
        else router.push(url)
    }

    const changeHandler = (text: string) => {
        setValue(text)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => go(text), 400)
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()
        clearTimeout(timer.current)
        go(value)
    }

    const clearHandler = () => {
        clearTimeout(timer.current)
        setValue('')
        inputRef.current?.focus()
        if (onSearchPage) router.replace('/search')
    }

    useEffect(() => () => clearTimeout(timer.current), [])

    return <form className={styles.form} role="search" onSubmit={submitHandler}>
        <Search className={styles.searchIcon} size={20} />
        <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="What do you want to play?"
            aria-label="Search songs or artists"
            autoComplete="off"
            value={value}
            onChange={e => changeHandler(e.target.value)}
        />
        {value && <button type="button" className={styles.clear} onClick={clearHandler} aria-label="Clear search">
            <X size={18} />
        </button>}
    </form>
}

export default HeaderSearch
