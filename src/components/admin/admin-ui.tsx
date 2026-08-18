import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function AdminPage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <main className={cn('admin-page', className)}>
      <div className="container">{children}</div>
    </main>
  )
}

export function AdminHeader({
  eyebrow = 'Admin',
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="admin-header admin-rise">
      <div className="min-w-0">
        <p className="admin-eyebrow">{eyebrow}</p>
        <h1 className="admin-title">{title}</h1>
        {description ? <p className="admin-lead">{description}</p> : null}
      </div>
      {actions ? <div className="admin-header__actions">{actions}</div> : null}
    </header>
  )
}

export function AdminCard({
  id,
  page,
  title,
  description,
  children,
  className,
}: {
  id?: string
  page?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('admin-card admin-rise', className)}>
      {title || page ? (
        <div className="admin-card__head">
          {page ? <p className="admin-card__page">{page}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      <div className="admin-card__body">{children}</div>
    </section>
  )
}

export function AdminField({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn('admin-field', className)}>
      <span>{label}</span>
      {children}
      {hint ? <span className="admin-hint">{hint}</span> : null}
    </label>
  )
}

export function AdminAlert({
  tone,
  children,
}: {
  tone: 'error' | 'success' | 'warn'
  children: ReactNode
}) {
  return <p className={cn('admin-alert', `admin-alert--${tone}`)}>{children}</p>
}

export function AdminEmpty({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="admin-empty">
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  )
}
