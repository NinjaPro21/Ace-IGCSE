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
      <span className="enlight-daily-quests__index" aria-hidden>
        {indexLabel}
      </span>
      <span className="enlight-daily-quests__body">
        <span className="enlight-daily-quests__title">{quest.title}</span>
        <span className="enlight-daily-quests__desc">{quest.description}</span>
      </span>
    </>
  )

  return (
    <li
      className={`enlight-daily-quests__row${quest.done ? ' enlight-daily-quests__row--done' : ''}`}
    >
      {quest.path && !quest.done ? (
        <Link to={quest.path} className="enlight-daily-quests__link">
          {body}
        </Link>
      ) : (
        <div className="enlight-daily-quests__static">{body}</div>
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
      <EnlightSectionLabel>Missions</EnlightSectionLabel>
      <div className="enlight-daily-quests__head">
        <div>
          <h2 className="enlight-daily-quests__heading">Today&apos;s missions</h2>
          {freezes > 0 && (
            <p className="enlight-daily-quests__sub">
              {freezes} streak freeze{freezes === 1 ? '' : 's'} banked
            </p>
          )}
        </div>
        <div className="enlight-daily-quests__aside">
          <span className="enlight-daily-quests__count">
            {doneCount} of {dailyQuests.quests.length}
          </span>
          {allDone && !dailyQuests.bonusClaimed && (
            <EnlightButton onClick={() => masteryEngine.claimDailyQuestBonus()}>
              +{DAILY_QUEST_BONUS_XP} XP
            </EnlightButton>
          )}
          {dailyQuests.bonusClaimed && (
            <span className="enlight-daily-quests__claimed">Bonus claimed</span>
          )}
        </div>
      </div>
      <ul className="enlight-daily-quests__list">
        {dailyQuests.quests.map((q, i) => (
          <QuestRow key={q.id} quest={q} index={i} />
        ))}
      </ul>
    </section>
  )
}
