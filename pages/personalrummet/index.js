import Login from "../../components/personalrummet/Login";
import UserMenu from "../../components/personalrummet/UserMenu";

import { useAuth } from "../../context/AuthContext";

import { personalrummet } from "../../styles/personalrummet.module.css";

export default function Personalrummet() {
  const { userData, signingIn } = useAuth();

  return (
    <div id="contentbody">
      <div id={personalrummet}>
        <h1>Personalrummet</h1>

        {signingIn && <p>Försöker logga in!</p>}
        {!userData && (
          <div>
            <p>
              Välkommen till personalrummet! Detta är en sida för förtroendevalda på CL-sektionen.
              Om du inte är förtroendevald och vill lägga upp ett inlägg ska du kontakta
              <a href="mailto:pr-ansvarig@cl-sektionen.se"> PR-ansvarig</a>. Ifall du är nämndaktiv
              ska du kontakta ordförande i din nämnd. Om du är förtroendevald men kan inte logga in
              ska du kontakta <a href="mailto:webbansvariga@cl-sektionen.se">webbansvariga</a> så
              löser dem det.
            </p>
            <Login />
          </div>
        )}
        {userData && <UserMenu />}
      </div>
    </div>
  );
}
