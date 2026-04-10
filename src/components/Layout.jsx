import { NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: "⊞", label: "Dashboard" },
  { to: "/issues", icon: "≡", label: "Issues" },
  { to: "/profile", icon: "◉", label: "Profile" },
  { to: "/admin", icon: "⚙", label: "Admin" },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <>
      <main className="page">{children}</main>

      <nav className="bottom-nav glass">
        {NAV_ITEMS.map(({ to, icon, label }) => {
          const isActive =
            to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-item-icon">{icon}</span>
              <span className="nav-item-label">{label}</span>
              <span className="nav-dot" />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
