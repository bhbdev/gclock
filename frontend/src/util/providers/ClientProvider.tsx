
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { GClockService } from "../../api/gclock_service_pb";
import React, { createContext } from 'react';

// create a connect transport
const transport = createConnectTransport({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
});
// create a connect client
const client = createClient(GClockService, transport);

// create a react context that will hold our client
const ClientContext = createContext(client);

// and a provider that will set the client
const ClientProvider: React.FC<{  children: React.ReactNode}> = ({ children }) => {

    return (
        <ClientContext.Provider value={client}>
            {children}
        </ClientContext.Provider>
    );
}

export { ClientContext, ClientProvider };
