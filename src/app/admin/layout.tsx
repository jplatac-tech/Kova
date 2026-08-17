import { AdminNav } from '../../components/admin/admin-nav'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  )
}
