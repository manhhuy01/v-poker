import CharmIcon from './charmIcon'
import { CHARMS, CHARM_DURATION_MS } from '../../utils/charms'
import styles from './charm.module.css'

// The charm floating next to a seat. Give it `key={charm.id}` so a new charm
// from the same player restarts the animation.
export default function CharmBadge({ type, value, className = '' }) {
  const name = CHARMS.find((c) => c.type === type)?.label
  if (!name) return null
  const label = type === 'dice' && value ? `${name}: ${value}` : name

  return (
    <div
      className={`${styles.badge} ${className}`}
      data-type={type}
      style={{ '--charm-life': `${CHARM_DURATION_MS}ms` }}
      role="img"
      aria-label={label}
      title={label}
    >
      <CharmIcon type={type} value={value} roll />
    </div>
  )
}
