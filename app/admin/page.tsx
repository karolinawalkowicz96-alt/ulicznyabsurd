import type { Metadata } from 'next';
import Admin from '@/components/admin/Admin';
import './admin.css';
export const metadata: Metadata = { title: 'Panel sklepu', robots: { index: false, follow: false } };
export default function AdminPage() { return <Admin />; }
