import { useState } from "react";
import { useRouter } from "next/router";
export default function Mottagning() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUrl = router.query.url;

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
        setError("Fel lösenord");
      } else {
        console.log(res);
        setError("Något gick fel");
      }
    }

    // Om lösenordet är rätt (res.status === 200) omdirigeras
    // användaren till mottagningssidan eller den sidan de försökte nå
    router.push(`/mottagning${redirectUrl ? "/" + redirectUrl : ""}`);
    setLoading(false);
  };

  return (
    <div id="contentbody">
      <div className="">
        <div className="">
          <h1 className="">This Page is Under Development... Mottagning 2023</h1>
          <p>Enter Password:</p>
          <div>
            {error && <p className="">{error}</p>}
            {loading && <p className="">Loading...</p>}
            <div className="input-group">
              <input
                type="text"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button className="btn" onClick={checkPassword}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
