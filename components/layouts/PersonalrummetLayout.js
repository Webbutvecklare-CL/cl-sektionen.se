import { AuthContextProvider } from "@/context/AuthContext";

import { useState } from "react";

export default function PersonalrummetLayout({ children }) {
	return (
		<>
			<AuthContextProvider>{children}</AuthContextProvider>
		</>
	);
}
