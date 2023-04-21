import React from "react";
import { useRouter } from "next/router";
import ValSlider from "./ValSlider";

export default function Valen() {
  const router = useRouter();
  const currentURL = router.asPath;
  const year = currentURL.substring(7, 11);
  const smNumber = currentURL.substring(12, 13);
  const smTitle = "SM#" + smNumber + " - " + year;
  const folderName = year + "-" + smNumber;
  return (
    <div id="contentbody">
      <h1>{smTitle}</h1>
      <ValSlider folderName={folderName} numberOfImages={4} />
    </div>
  );
}
