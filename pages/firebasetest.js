import React, { useMemo } from "react";

import { firestore } from "../firebase/clientApp";
import enableMessaging from "../firebase/messaging";

export default function Firebase() {
  return (
    <div id="contentbody">
      <h1>Firebase</h1>
      <div>
        <button onClick={enableMessaging}>Notiser</button>
      </div>
    </div>
  );
}
