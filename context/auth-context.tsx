"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  isConnected: boolean
  address: string | undefined
  displayName: string | undefined
  isLoading: boolean
  openConnectModal: () => void
  disconnect: () => void
}

const AuthContext = createContext<AuthContextType>({
  isConnected: false,
  address: undefined,
  displayName: undefined,
  isLoading: true,
  openConnectModal: () => {},
  disconnect: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [displayName, setDisplayName] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Mock wallet addresses for demo purposes
  const mockWallets = [
    { address: "0x1a2b3c4d5e6f7g8h9i0j", name: "Demo Wallet 1" },
    { address: "0x4d5e6f7g8h9i0j1a2b3c", name: "Demo Wallet 2" },
    { address: "0x7g8h9i0j1a2b3c4d5e6f", name: "Demo Wallet 3" },
  ]

  useEffect(() => {
    // Check if user is already connected
    const checkConnection = async () => {
      try {
        // Check local storage for a saved connection
        const savedAddress = localStorage.getItem("userAddress")

        if (savedAddress) {
          setAddress(savedAddress)
          setDisplayName(`${savedAddress.substring(0, 6)}...${savedAddress.substring(savedAddress.length - 4)}`)
          setIsConnected(true)
        }
      } catch (error) {
        console.error("Failed to check connection:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  const openConnectModal = () => {
    // For demo purposes, just connect with the first mock wallet
    const selectedWallet = mockWallets[0]
    setAddress(selectedWallet.address)
    setDisplayName(
      `${selectedWallet.address.substring(0, 6)}...${selectedWallet.address.substring(selectedWallet.address.length - 4)}`,
    )
    setIsConnected(true)
    localStorage.setItem("userAddress", selectedWallet.address)
  }

  const disconnect = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("userAddress")

      // Update state
      setIsConnected(false)
      setAddress(undefined)
      setDisplayName(undefined)
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        address,
        displayName,
        isLoading,
        openConnectModal,
        disconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
