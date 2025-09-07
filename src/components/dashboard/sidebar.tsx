'use client';
import { useRouter, usePathname } from 'next/navigation';
import { MdDashboard } from 'react-icons/md';
import { GiMedicines } from 'react-icons/gi';
import { AiFillMedicineBox } from 'react-icons/ai';
import { IoPieChartSharp, IoSettings } from 'react-icons/io5';
import { FaCartArrowDown } from 'react-icons/fa';
import { BiSolidBarChartSquare } from 'react-icons/bi';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { ImStatsBars, ImStatsBars2 } from 'react-icons/im';
import { Sidebar, SidebarGroup, SidebarItem } from '../ui/sidebar';

type SidebarProps = {
  onClose: () => void;
  isOpen: boolean;
};

export default function AppSidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <Sidebar isOpen={isOpen}>
        <SidebarGroup label="General">
          <SidebarItem
            icon={MdDashboard}
            label="Dashboard"
            active={pathname === '/dashboard'}
            onClick={() => {
              router.push('/dashboard');
              onClose();
            }}
          />
          <SidebarItem
            icon={AiFillMedicineBox}
            label="Stocks"
            active={pathname.startsWith('/dashboard/stock')}
            onClick={() => {
              router.push('/dashboard/stock');
              onClose();
            }}
          />
          <SidebarItem
            icon={FaCartArrowDown}
            label="Purchases"
            active={pathname.startsWith('/dashboard/purchase')}
            onClick={() => {
              router.push('/dashboard/purchase');
              onClose();
            }}
          />
          <SidebarItem
            icon={BiSolidBarChartSquare}
            label="Sells"
            active={pathname.startsWith('/dashboard/sell')}
            onClick={() => {
              router.push('/dashboard/sell');
              onClose();
            }}
          />
        </SidebarGroup>

        <SidebarGroup label="Invoices">
          <SidebarItem
            icon={BsFillCartCheckFill}
            label="Purchases Invoices"
            active={pathname.startsWith('/dashboard/purchase-invoices')}
            onClick={() => {
              router.push('/dashboard/purchase-invoices');
              onClose();
            }}
          />
          <SidebarItem
            icon={IoPieChartSharp}
            label="Sells Invoices"
            active={pathname.startsWith('/dashboard/sell-invoices')}
            onClick={() => {
              router.push('/dashboard/sell-invoices');
              onClose();
            }}
          />
          <SidebarItem
            icon={ImStatsBars}
            label="Purchase Returns"
            active={pathname.startsWith('/dashboard/purchase-returns')}
            onClick={() => {
              router.push('/dashboard/purchase-returns');
              onClose();
            }}
          />
          <SidebarItem
            icon={ImStatsBars2}
            label="Sell Returns"
            active={pathname.startsWith('/dashboard/sell-returns')}
            onClick={() => {
              router.push('/dashboard/sell-returns');
              onClose();
            }}
          />
        </SidebarGroup>

        <SidebarGroup label="Others">
          <SidebarItem
            icon={GiMedicines}
            label="Expiry Alert"
            active={pathname.startsWith('/dashboard/expiry')}
            onClick={() => {
              router.push('/dashboard/expiry');
              onClose();
            }}
          />
          <SidebarItem
            icon={IoSettings}
            label="Settings"
            active={pathname.startsWith('/dashboard/settings')}
            onClick={() => {
              router.push('/dashboard/settings');
              onClose();
            }}
          />
        </SidebarGroup>
      </Sidebar>
    </>
  );
}
