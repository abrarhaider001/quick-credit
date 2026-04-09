import { Card } from '@/components/ui/Card'

export default function HomeProfilePanel() {
  return (
    <div className="home-tab">
      <header className="home-tab__header">
        <p className="home-tab__eyebrow">Account</p>
        <h1 className="home-tab__title">Profile</h1>
        <p className="home-tab__desc">
          Profile management, KYC hints, and preferences will follow your Profile prompt.
        </p>
      </header>
      <Card>
        <p className="home-tab__placeholder">
          Placeholder — editable fields and avatar upload TBD.
        </p>
      </Card>
    </div>
  )
}
