import { useRouter } from "next/router";
import Router from "next/router";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  function handleBackClick() {
    // Användaren har en historik som går att gå tillbaka i.
    // Optimalt vore att kolla om historiken är från vår sida och inte typ FB.
    // Om historiken är 1 så är det den aktuella sidan dvs ingen historik
    if (window?.history?.length < 2) {
      // Om användaren öppnat en länk till sång/inlägg i en ny flik
      router.push("/");
      return;
    }

    // Kan leda en till baka till facebook eller till ex sångboken
    router.back();
  }

  return (
    <button className="back-button" onClick={handleBackClick}>
      <i className="fa fa-arrow-left" aria-hidden="true" /> Tillbaka
    </button>
  );
}
