import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";

import CustomHead from "@/components/CustomHead";

import styles from "@/styles/mottagning/mottagning.module.css";

import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import NotificationBell from "@/components/NotificationBell";
import FeedItem from "@/components/mottagning/FeedItem";

// Innehållet på mottagningssidan kan kommas åt via klienten (utöver github)
// Därför ska inget känsligt innehåll vara inkodat här
export default function Mottagning({ loggedIn, _posts }) {
	const router = useRouter();
	const [error, setError] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const [showMenu, setShowMenu] = useState(loggedIn);
	const [showWelcometext, setShowWelcometext] = useState(false);
	const [posts, setPosts] = useState(_posts);

	const redirectUrl = router.query.url;

	const [fokusSearchBar, setfokusSearchBar] = useState(false);
	useEffect(() => {
		const focusSearchHandler = (e) => {
			if (!fokusSearchBar && e.target.className === "searchbar") {
				setfokusSearchBar(true);
			} else if (fokusSearchBar && e.target.className !== "searchbar") {
				setfokusSearchBar(false);
			}
		};

		document.addEventListener("mousedown", focusSearchHandler);
		return () => {
			document.removeEventListener("mousedown", focusSearchHandler);
		};
	});

	const checkPassword = async () => {
		setLoading(true);
		const res = await fetch("/api/mottagning-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ type: "password", password }),
		});

		if (res.status !== 200) {
			res.json().then((data) => {
				console.error(data.error);
			});
			if (res.status === 429) {
				setError("För många försök, försök igen senare");
			} else if (res.status === 401) {
				setError(
					`Fel lösenord! Du har ${res.headers.get(
						"X-RateLimit-Remaining",
					)} försök kvar.`,
				);
			} else {
				console.log(res);
				setError("Något gick fel");
			}
			setLoading(false);
			return;
		}

		// Om lösenordet är rätt (res.status === 200) visas välkomst komponenten om
		// de försökte nå en annan sida omdirigeras användaren till den sidan
		if (redirectUrl) {
			router.push(`/mottagning/${redirectUrl}`);
		} else {
			setShowMenu(true);
			const mottagning_key = await res
				.json()
				.then((data) => data.mottagning_key);
			try {
				const _posts = await getKeyResponse(mottagning_key);
				setPosts(_posts);
			} catch (error) {
				console.log(error);
			}
		}
		setLoading(false);
	};

	return (
		<>
			<CustomHead
				metaTitle={"Mottagningssidan | Sektionen för Civilingenjör och Lärare"}
				description={
					"Här hittar du all information och nyheter för mottagningen."
				}
				url={"https://www.cl-sektionen.se/mottagning/"}
			/>
			<div id="contentbody">
				<div className="small-header">
					<h1>Mottagningssidan</h1>
					<div
						className={`${styles.welcomePanel} ${
							showWelcometext ? styles.active : ""
						}`}
					>
						<p>
							Är du nyantagen? Du kommer få mer information via mail inom kort.
							Om du inte har fått något mail hör av dig till{" "}
							<a href="mailto:mottagningen@cl-sektionen.se">
								mottagningen@cl-sektionen.se
							</a>
							. Denna sidan är till för alla nyantagna som deltar eller funderar
							på att delta i mottagningen. Här kommer aktuell information läggas
							upp kontinuerligt under mottagningen.
						</p>
					</div>
					<button
						type="button"
						className={styles.showMoreButton}
						onClick={() => setShowWelcometext(!showWelcometext)}
					>
						Visa
						{showWelcometext ? " mindre " : " mer "}
						<FontAwesomeIcon icon={showWelcometext ? faAngleUp : faAngleDown} />
					</button>

					{!showMenu && (
						<div id={styles.loginPanel}>
							<h2>Ditt kodord</h2>
							<div className={styles.inputField}>
								{error && <p className="">{error}</p>}
								{loading && <p className="">Laddar...</p>}
								<div className={`inputfält ${fokusSearchBar ? "active" : ""}`}>
									<input
										type="password"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												checkPassword();
											}
										}}
										className={"searchbar"}
									/>
									<button
										type="button"
										className={styles.inputSubmit}
										onClick={checkPassword}
									>
										Logga in
									</button>
								</div>
								<div className={styles.hint}>
									För att komma åt mottagningssidan behöver du skriva in
									kodordet. Den går att hitta i Adeptboken samt välkomstmejlet.
								</div>
							</div>
						</div>
					)}
					{showMenu && (
						<div className={styles.wrapper}>
							<div className={styles.navPanel}>
								<div>
									<h2>Hitta på mottagningssidan</h2>
								</div>
								<div className={styles.nav}>
									<Link href={"mottagning/schema"}>Schema</Link>
									<Link href={"mottagning/bilder"}>Bilder</Link>
									<Link href={"mottagning/info"}>Info-dump</Link>
									<Link href={"mottagning/kontakt"}>Kontakt</Link>
									<Link
										href={
											"https://drive.google.com/file/d/179imNdlLjc7HHg8RrhsBiioScjwWBtek/view?usp=sharing"
										}
										target="_blank"
									>
										Adeptboken
									</Link>
									<Link href={"sangbok"}>Sångboken</Link>
								</div>
							</div>
							<div className={styles.feedWrapper}>
								<div className={styles.feedHeader}>
									<h2>Mottagningsinfo</h2>
									<NotificationBell />
								</div>
								<div className={styles.feed}>
									{posts?.map((item, index) => (
										<FeedItem key={index} item={item} />
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	// Kollar om användaren har en mottagning_key och om den stämmer
	// Körs server side dvs MOTTAGNING_KEY exponeras inte
	const mottagning_key = context.req.cookies.mottagning_key;

	const loggedIn = mottagning_key === process.env.MOTTAGNING_KEY;

	let posts = [];
	if (loggedIn) {
		try {
			posts = await getKeyResponse(mottagning_key);
		} catch (error) {
			console.error(error);
		}
	}

	return {
		props: {
			loggedIn,
			_posts: posts,
		},
	};
}

function getKeyResponse(key) {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/mottagning-password`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				mottagning_key: key,
			},
		})
			.then((res) => {
				if (res.status !== 200) {
					reject(res);
				}
				return res.json();
			})
			.then((data) => {
				if (data.error) {
					console.error(data.error);
				}
				let posts = [];
				if (data.posts) {
					posts = data.posts.sort(
						(a, b) => b.publishDate._seconds - a.publishDate._seconds,
					);
				}
				resolve(posts);
			})
			.catch((error) => {
				console.error(error);
				reject(error);
			});
	});
}
