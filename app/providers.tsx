'use client'

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from 'react-query/devtools'

interface Props {
  children?: React.ReactNode
}

const queryClient = new QueryClient()

export const NextProvider = ({ children }: Props) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
      </QueryClientProvider>
      </RecoilRoot>
  ) 
}

export const NextLayout = ({ children }: Props) => {
  return (
  <>
  <Navbar />
  {children}
  <Footer />
  </>
  )
}