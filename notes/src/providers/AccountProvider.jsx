import { createContext, useState } from "react";
import { ethers } from "ethers";

export const AccountContext = createContext();

export const AccountProvider = ({children}) => {
    const [account, setAccount] = useState(null);

    const getAccount = async () => {
                if (window.ethereum) {
                    try {
                        const provider = new ethers.BrowserProvider(
                            window.ethereum
                        );
                        const signer = await provider.getSigner();
                        const address = await signer.getAddress();                    
                        if (address) {
                            setAccount(address);
                        } else {
                            setAccount(null);
                        }
                    } catch (error) {
                        console.error("Error init wallet", error);
                    }
                }
            };

    return (
        <AccountContext.Provider value={{ account, setAccount, getAccount }}>
            {children}
        </AccountContext.Provider>
    )
}