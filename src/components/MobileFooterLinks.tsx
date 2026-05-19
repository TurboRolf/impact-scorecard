import { Link } from "react-router-dom";

/**
 * Compact footer with About / Privacy / Terms / Contact links.
 * Visible on mobile and tablet where the right sidebar is hidden.
 */
const MobileFooterLinks = ({
  className = "",
  always = false,
}: {
  className?: string;
  always?: boolean;
}) => (
  <footer
    className={`${always ? "" : "xl:hidden"} mt-6 px-2 text-[11px] text-muted-foreground text-center space-y-1 ${className}`}
  >
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/help" className="hover:underline">Help</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
    <p>© 2026 Ethisay</p>
  </footer>
);

export default MobileFooterLinks;