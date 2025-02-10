import { useContext } from "react"
import { ClientContext } from "../providers/ClientProvider"

export const useClient = () => {
    const client = useContext(ClientContext)
    if (!client) {
      throw new Error('No Client set, use ClientProvider to set one')
    }
    return client
}