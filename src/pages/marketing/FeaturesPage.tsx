import { EnlightCard, EnlightSectionLabel } from '@/components/EnlightCard'

const FEATURES = [
  {
    icon: '📚',
    title: 'Subject notes',
    body: 'Every subtopic has compressed notes: core idea, key formulas, worked examples, common mistakes, and examiner tips.',
  },
  {
    icon: '🧠',
    title: 'Tiered quizzes',
    body: 'Five questions per attempt across Easy, Medium, Hard, and PYP tiers. Pass to unlock the next difficulty.',
  },
  {
    icon: '📊',
    title: 'Interactive graphs',
    body: 'Drag sliders on quadratics, trig graphs, vectors, differentiation, and more — see how equations behave live.',
  },
  {
    icon: '⏱',
    title: 'Pomodoro timer',
    body: 'Study sessions built into every lesson. Hit your daily goal and keep your streak alive.',
  },
  {
    icon: '📋',
    title: 'Mistake log',
    body: 'After each quiz, review every wrong answer with explanations. Recurring weak concepts get flagged automatically.',
  },
  {
    icon: '🏆',
    title: 'Leaderboards & duels',
    body: 'Weekly XP ranks, school clans, and head-to-head quiz duels with friends.',
  },
]

export function FeaturesPage() {
  return (
    <div className="enlight-container enlight-page-padding enlight-marketing-page">
      <EnlightSectionLabel>Features</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Built for real revision</h1>
      <p className="enlight-body-text enlight-marketing-page__lead">
        Every feature is designed around how IGCSE students actually study — not how publishers think
        they should.
      </p>
      <div className="enlight-feature-grid" style={{ marginTop: 32 }}>
        {FEATURES.map((f) => (
          <EnlightCard key={f.title}>
            <div className="enlight-feature-card__icon">{f.icon}</div>
            <h3 className="enlight-feature-card__title">{f.title}</h3>
            <p className="enlight-body-text">{f.body}</p>
          </EnlightCard>
        ))}
      </div>
    </div>
  )
}
