import { AuthContextProvider } from "@/context/AuthContext";

export default function PersonalrummetLayout({ children }) {
	return (
		<>
			<AuthContextProvider>{children}</AuthContextProvider>
		</>
	);
}
