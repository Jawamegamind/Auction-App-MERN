import { createContext, useState } from "react";

export const UserContext = createContext<any>(null);

function UserProvider({ children }: any) {
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;