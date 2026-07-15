import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { DAILY_QUEST_BONUS_XP, type DailyQuest } from '@/features/mastery/dailyQuests'

function QuestRow({ quest }: { quest: DailyQuest }) {
  const inner = (
    <>
      <input type="checkbox" checked={quest.done} readOnly aria-hidden className="enlight-study-plan__check" />
      <div className="enlight-study-plan__task-body">
        <span className={`enlight-study-plan__task-link${quest.done ? ' enlight-study-plan__task--done' : ''}`}>
          {quest.title}
        </span>
        <span className="enlight-study-plan__task-topic">{quest.description}</span>
      </div>
    </>
  )

  return (
    <li className={`enlight-study-plan__task${quest.done ? ' enlight-study-plan__task--done' : ''}`}>
      {quest.path && !quest.done ? (
        <Link to={quest.path} className="enlight-study-plan__task-row-link">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  )
}

export function DailyQuestsPanel() {
  const { dailyQuests, progress } = useMastery()
  if (!dailyQuests || dailyQuests.quests.length === 0) return null

  const doneCount = dailyQuests.quests.filter((q) => q.done).length
  const allDone = doneCount === dailyQuests.quests.length
  const freezes = progress.streakFreezes ?? 0

  return (
    <section className="enlight-dashboard-card enlight-daily-quests" aria-label="Daily quests">
      <EnlightSectionLabel>Daily quests</EnlightSectionLabel>
      <div className="enlight-study-plan__head">
        <div>
          <h2 className="enlight-study-plan__title">Today&apos;s missions</h2>
          <p className="enlight-study-plan__sub">
            {doneCount} of {dailyQuests.quests.length} complete
            {freezes > 0 ? ` · ${freezes} streak freeze${freezes === 1 ? '' : 's'} banked` : ''}
          </p>
        </div>
        {allDone && !dailyQuests.bonusClaimed && (
          <EnlightButton onClick={() => masteryEngine.claimDailyQuestBonus()}>
            +{DAILY_QUEST_BONUS_XP} XP
          </EnlightButton>
        )}
        {dailyQuests.bonusClaimed && (
          <span className="enlight-dash-goal__check" aria-label="Bonus claimed">
            ✓
          </span>
        )}
      </div>
      <ul className="enlight-study-plan__tasks">
        {dailyQuests.quests.map((q) => (
          <QuestRow key={q.id} quest={q} />
        ))}
      </ul>
      {allDone && !dailyQuests.bonusClaimed && (
        <p className="enlight-body-text enlight-daily-quests__bonus-hint">
          All missions done — claim your +{DAILY_QUEST_BONUS_XP} XP bonus!
        </p>
      )}
    </section>
  )
}
