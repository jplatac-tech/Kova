import { AdminNav } from '../../components/admin/admin-nav'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-shell__main">{children}</div>
    </div>
  )
}
