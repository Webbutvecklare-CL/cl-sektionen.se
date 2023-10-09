import definitions from "@/content/data/ordbok.json";

import styles from "@/styles/definition.module.css";
import { useEffect, useRef } from "react";

export default function Definition({ term, text, children }) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      let { left, right } = tooltipRef.current.getBoundingClientRect();

      let offset = 0;
      if (left < 0) {
        offset = left - 30;
      } else if (right > window.innerWidth) {
        offset = right - window.innerWidth + 30;
      }
      tooltipRef.current.style.setProperty("--offset", `${offset}px`);
    }
    handleResize();
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleClick = () => {
    let { left, right } = tooltipRef.current.getBoundingClientRect();
    console.log(left, right - window.innerWidth);
  };

  // Hittar ordet i ordlistan
  const definition = definitions.filter((word) => word.begrepp === term)[0];

  // Plockar ut betydelsen
  const description = definition?.betydelse || "Förklaring saknas, kolla i ordboken.";
  return (
    <span className={styles.container} onClick={handleClick}>
      {text || children}
      <span ref={tooltipRef} className={styles.tooltip}>
        {description}
      </span>
    </span>
  );
}
