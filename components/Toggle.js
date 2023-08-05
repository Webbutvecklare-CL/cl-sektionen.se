import { useEffect, useState } from "react";
import { toggle as styles } from "../styles/components.module.css";
export default function Toggle({ children, toggled, onClick }) {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
    onClick(!isToggled);
    toggle(!isToggled);
  };

  return (
    <label className={styles}>
      <input type="checkbox" checked={toggled} onChange={callback} />
      <span />
      <strong>{children}</strong>
    </label>
  );
}
