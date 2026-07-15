import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { DAILY_QUEST_BONUS_XP, type DailyQuest } from '@/features/mastery/dailyQuests'

function QuestRow({ quest, index }: { quest: DailyQuest; index: number }) {
  const indexLabel = String(index + 1).padStart(2, '0')
  const body = (
    <>
      <span className="ace-daily-quests__index" aria-hidden>
        {indexLabel}
      </span>
      <span className="ace-daily-quests__body">
        <span className="ace-daily-quests__title">{quest.title}</span>
        <span className="ace-daily-quests__desc">{quest.description}</span>
      </span>
    </>
  )

  return (
    <li
      className={`ace-daily-quests__row${quest.done ? ' ace-daily-quests__row--done' : ''}`}
    >
      {quest.path && !quest.done ? (
        <Link to={quest.path} className="ace-daily-quests__link">
          {body}
        </Link>
      ) : (
        <div className="ace-daily-quests__static">{body}</div>
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
    <section className="ace-dashboard-card ace-daily-quests" aria-label="Daily quests">
      <EnlightSectionLabel>Missions</EnlightSectionLabel>
      <div className="ace-daily-quests__head">
        <div>
          <h2 className="ace-daily-quests__heading">Today&apos;s missions</h2>
          {freezes > 0 && (
            <p className="ace-daily-quests__sub">
              {freezes} streak freeze{freezes === 1 ? '' : 's'} banked
            </p>
          )}
        </div>
        <div className="ace-daily-quests__aside">
          <span className="ace-daily-quests__count">
            {doneCount} of {dailyQuests.quests.length}
          </span>
          {allDone && !dailyQuests.bonusClaimed && (
            <EnlightButton onClick={() => masteryEngine.claimDailyQuestBonus()}>
              +{DAILY_QUEST_BONUS_XP} XP
            </EnlightButton>
          )}
          {dailyQuests.bonusClaimed && (
            <span className="ace-daily-quests__claimed">Bonus claimed</span>
          )}
        </div>
      </div>
      <ul className="ace-daily-quests__list">
        {dailyQuests.quests.map((q, i) => (
          <QuestRow key={q.id} quest={q} index={i} />
        ))}
      </ul>
    </section>
  )
}
