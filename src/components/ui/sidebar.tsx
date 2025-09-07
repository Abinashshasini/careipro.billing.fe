import { RiAppsFill } from 'react-icons/ri';

function Sidebar({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 h-screen bg-gray-900 text-white flex flex-col transition-transform duration-300 w-64 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 h-16 border-r-1 border-gray-900">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <RiAppsFill className="text-white" />
          </div>
          <div>
            <div className="font-semibold">Careipro</div>
            <div className="text-xs text-gray-400">Medicine Billing</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">{children}</nav>

      {/* Footer */}
      <div className="p-4 bg-gray-800 text-center text-xs">
        <div className="font-semibold">Careipro Pvt Ltd.</div>
        <div className="text-gray-400">© 2025 All rights reserved.</div>
      </div>
    </aside>
  );
}

function SidebarGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-2 py-3">
      <div className="uppercase text-xs text-gray-400 px-2 mb-2">{label}</div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? 'bg-primary text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Icon className="text-lg" />
        <span>{label}</span>
      </button>
    </li>
  );
}

export { Sidebar, SidebarGroup, SidebarItem };
