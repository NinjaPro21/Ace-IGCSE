import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { AnalyticsBarChart } from '@/components/analytics/AnalyticsBarChart'
import { MetricCard } from '@/components/analytics/MetricCard'
import { fetchPlatformStats, type PlatformStats } from '@/features/analytics/analyticsApi'
import {
  computeStudyMetrics,
  countActiveInLastDays,
  formatDuration,
  formatDurationHours,
  getMemberStudyRows,
} from '@/features/analytics/studyMetrics'
import { getClassChapterInsights, getStuckChapters } from '@/features/mastery/tutorInsights'
import { useMastery } from '@/features/mastery/MasteryContext'
import { fetchSchoolMemberProfiles } from '@/features/social/socialApi'
import { useAuth } from '@/features/social/AuthContext'

export function AnalyticsPage() {
  const { progress } = useMastery()
  const { school, user, syncProgressNow } = useAuth()

  const [platform, setPlatform] = useState<PlatformStats | null>(null)
  const [schoolProfiles, setSchoolProfiles] = useState<Awaited<ReturnType<typeof fetchSchoolMemberProfiles>>>([])
  const [loading, setLoading] = useState(true)

  const personal = computeStudyMetrics(progress)
  const memberRows = getMemberStudyRows(schoolProfiles)
  const classStudySec = memberRows.reduce((sum, r) => sum + r.studySec, 0)
  const classInsights = getStuckChapters(getClassChapterInsights(schoolProfiles), 6)
  const activeSchool7d = countActiveInLastDays(schoolProfiles, 7)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    void (async () => {
      const stats = await fetchPlatformStats()
      if (cancelled) return
      setPlatform(stats)

      if (school) {
        const profiles = await fetchSchoolMemberProfiles(school.id)
        if (!cancelled) setSchoolProfiles(profiles)
      } else {
        setSchoolProfiles([])
      }

      if (!cancelled) setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [school])

  const refresh = async () => {
    await syncProgressNow()
    const stats = await fetchPlatformStats()
    setPlatform(stats)
    if (school) setSchoolProfiles(await fetchSchoolMemberProfiles(school.id))
  }

  return (
    <div className="enlight-app">
      <EnlightHeader />

      <div className="enlight-container enlight-page-padding enlight-analytics-page">
        <EnlightSectionLabel>Data dashboard</EnlightSectionLabel>
        <h1 className="enlight-heading-serif">Analytics</h1>
        <p className="enlight-body-text enlight-analytics-page__intro">
          Platform-wide totals update when students sync progress. Class charts use your school group
          data.
        </p>

        <div className="enlight-analytics-page__actions">
          <EnlightButton variant="outline" onClick={() => refresh()}>
            Refresh data
          </EnlightButton>
          <EnlightButton to="/progress" variant="outline">Back to progress</EnlightButton>
        </div>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">Platform overview</h2>
          <div className="enlight-metric-grid">
            <MetricCard
              label="Total sign-ups"
              value={loading ? '…' : String(platform?.totalSignUps ?? 0)}
              hint="New Google accounts on Enlight"
              accent="gold"
            />
            <MetricCard
              label="Total study time"
              value={loading ? '…' : formatDurationHours(platform?.totalStudySeconds ?? 0)}
              hint={`${(platform?.totalStudySeconds ?? 0).toLocaleString()} seconds tracked`}
              accent="mint"
            />
            <MetricCard
              label="Quiz attempts"
              value={loading ? '…' : String(platform?.totalQuizAttempts ?? 0)}
              hint="All tiers, all students"
            />
            <MetricCard
              label="Last platform update"
              value={
                loading
                  ? '…'
                  : platform?.updatedAt
                    ? platform.updatedAt.toLocaleString()
                    : 'Not yet'
              }
              hint="Firestore sync timestamp"
            />
          </div>
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">Your study breakdown</h2>
          <div className="enlight-metric-grid enlight-metric-grid--3">
            <MetricCard label="Your total time" value={formatDurationHours(personal.totalStudySec)} accent="mint" />
            <MetricCard label="Topics completed" value={String(personal.topicsCompleted)} />
            <MetricCard label="Chapters mastered" value={String(personal.chaptersMastered)} />
          </div>
          <AnalyticsBarChart
            title="Where your time goes"
            items={[
              { label: 'Topic lessons', value: personal.topicStudySec },
              { label: 'Chapters & quizzes', value: personal.chapterStudySec },
            ]}
            valueFormatter={(n) => formatDuration(n)}
            emptyMessage="Start studying to see your breakdown."
          />
        </section>

        {school && (
          <section className="enlight-analytics-section">
            <h2 className="enlight-heading-serif enlight-analytics-section__title">
              {school.name} · class data
            </h2>
            <div className="enlight-metric-grid enlight-metric-grid--3">
              <MetricCard label="Members" value={String(memberRows.length)} />
              <MetricCard
                label="Class study time"
                value={formatDurationHours(classStudySec)}
                accent="gold"
              />
              <MetricCard
                label="Active (7 days)"
                value={String(activeSchool7d)}
                hint="Studied in the last week"
                accent="mint"
              />
            </div>

            <AnalyticsBarChart
              title="Study time by student"
              items={memberRows.slice(0, 10).map((r) => ({
                label: r.userId === user?.id ? `${r.displayName} (you)` : r.displayName,
                value: r.studySec,
                sublabel: `${r.xp} XP`,
              }))}
              valueFormatter={(n) => formatDuration(n)}
              emptyMessage="No class study data yet — students need to sync while signed in."
            />

            <AnalyticsBarChart
              title="XP by student"
              items={[...memberRows]
                .sort((a, b) => b.xp - a.xp)
                .slice(0, 10)
                .map((r) => ({
                  label: r.userId === user?.id ? `${r.displayName} (you)` : r.displayName,
                  value: r.xp,
                }))}
              valueFormatter={(n) => `${n} XP`}
            />

            <AnalyticsBarChart
              title="Toughest chapters (class)"
              items={classInsights.map((c) => ({
                label: c.chapterTitle,
                value: c.timeSpentMin,
                sublabel: `${c.failRate}% fail · ${c.studentCount} students`,
              }))}
              valueFormatter={(n) => `${n} min`}
              emptyMessage="Chapter difficulty appears after students read and quiz."
            />
          </section>
        )}

        {!school && (
          <section className="enlight-analytics-section">
            <p className="enlight-body-text">
              Join or create a school on the Progress page to see per-student charts and class focus
              areas here.
            </p>
            <EnlightButton to="/progress" variant="outline">Go to Progress</EnlightButton>
          </section>
        )}
      </div>

      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
