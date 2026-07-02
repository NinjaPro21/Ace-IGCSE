import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { AnalyticsBarChart } from '@/components/analytics/AnalyticsBarChart'
import { MetricCard } from '@/components/analytics/MetricCard'
import { fetchPlatformStats, type PlatformStats } from '@/features/analytics/analyticsApi'
import {
  aggregateSiteTotals,
  computeSiteStudyBreakdown,
  rankChaptersSiteWide,
  rankSubjectsByStruggle,
  rankTopicsSiteWide,
  worstChapterPerSubject,
} from '@/features/analytics/siteAnalytics'
import {
  computeActivationFunnel,
  computeRetentionCohorts,
  computeTopicPassRates,
} from '@/features/analytics/platformAnalytics'
import { formatDuration, formatDurationHours } from '@/features/analytics/studyMetrics'
import { fetchAllProfilesForAdmin } from '@/features/social/socialApi'
import { useAuth } from '@/features/social/AuthContext'

export function AnalyticsPage() {
  const { syncProgressNow } = useAuth()

  const [platform, setPlatform] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<Awaited<ReturnType<typeof fetchAllProfilesForAdmin>>>([])

  const siteTotals = aggregateSiteTotals(profiles)
  const topicRanks = rankTopicsSiteWide(profiles, 20)
  const worstBySubject = worstChapterPerSubject(profiles)
  const chapterRanks = rankChaptersSiteWide(profiles, 12)
  const subjectStruggle = rankSubjectsByStruggle(profiles)
  const studyBreakdown = computeSiteStudyBreakdown(profiles)
  const funnel = computeActivationFunnel(profiles)
  const cohorts = computeRetentionCohorts(profiles)
  const topicPassRates = computeTopicPassRates(profiles, 20)
  const sampleNote =
    profiles.length < 10
      ? `Pilot data (n=${profiles.length}) — interpret trends cautiously until launch.`
      : null

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    void (async () => {
      try {
        setLoadError(null)
        const [stats, allProfiles] = await Promise.all([
          fetchPlatformStats(),
          fetchAllProfilesForAdmin(),
        ])
        if (cancelled) return
        setPlatform(stats)
        setProfiles(allProfiles)
      } catch (err) {
        if (cancelled) return
        setLoadError(err instanceof Error ? err.message : 'Failed to load analytics')
        setPlatform(null)
        setProfiles([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const refresh = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      await syncProgressNow()
      const [stats, allProfiles] = await Promise.all([
        fetchPlatformStats(),
        fetchAllProfilesForAdmin(),
      ])
      setPlatform(stats)
      setProfiles(allProfiles)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to refresh analytics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="enlight-app">
      <EnlightHeader />

      <div className="enlight-container enlight-page-padding enlight-analytics-page">
        <EnlightSectionLabel>Admin · site analytics</EnlightSectionLabel>
        <h1 className="enlight-heading-serif">Platform statistics</h1>
        <p className="enlight-body-text enlight-analytics-page__intro">
          Website-wide aggregates from synced student profiles. Use topic and chapter rankings to
          spot where students spend time and struggle most.
        </p>

        <div className="enlight-analytics-page__actions">
          <EnlightButton variant="outline" onClick={() => refresh()}>
            Refresh data
          </EnlightButton>
          <EnlightButton to="/dashboard" variant="outline">Back to dashboard</EnlightButton>
        </div>

        {loadError ? (
          <div className="enlight-analytics-page__error" role="alert">
            <p className="enlight-body-text">
              Could not load analytics: {loadError}
            </p>
            <p className="enlight-body-text">
              Ensure Firestore rules are deployed and your account is listed in{' '}
              <code>config/site.adminEmails</code> or has an <code>admins/&#123;uid&#125;</code> document.
              Also set <code>VITE_ADMIN_EMAILS</code> in <code>.env.local</code> to match.
            </p>
          </div>
        ) : null}

        {sampleNote ? (
          <p className="enlight-body-text enlight-analytics-page__sample-note">{sampleNote}</p>
        ) : null}

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">Activation funnel</h2>
          <p className="enlight-body-text">
            Share of synced profiles reaching each milestone (n={profiles.length}).
          </p>
          <AnalyticsBarChart
            title="Student journey"
            items={funnel.map((step) => ({
              label: step.label,
              value: step.count,
              sublabel: `${step.ratePercent}% of registered`,
            }))}
            valueFormatter={(n) => String(n)}
            emptyMessage="No profiles synced yet."
          />
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">Retention cohorts</h2>
          <p className="enlight-body-text">
            Week-by-week % of each signup cohort that studied (based on active dates). Week 0 = cohort
            start week.
          </p>
          {cohorts.length === 0 ? (
            <p className="enlight-body-text">Cohorts appear after users study on multiple days.</p>
          ) : (
            <div className="enlight-cohort-table-wrap">
              <table className="enlight-cohort-table">
                <thead>
                  <tr>
                    <th>Cohort</th>
                    <th>n</th>
                    {cohorts[0]?.weeks.map((_, i) => (
                      <th key={i}>W{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((row) => (
                    <tr key={row.cohortStart}>
                      <td>{row.cohortLabel}</td>
                      <td>{row.size}</td>
                      {row.weeks.map((pct, i) => (
                        <td key={i} className={pct >= 50 ? 'enlight-cohort-table__hot' : undefined}>
                          {pct}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">
            Topic pass rates (lowest first)
          </h2>
          <p className="enlight-body-text">
            Pass = score ≥ 70% or mastery level unlocked. Shows attempted students (n) per tier.
          </p>
          <div className="enlight-insights-table">
            {topicPassRates.length === 0 ? (
              <p className="enlight-body-text">Pass rates appear after students attempt topic quizzes.</p>
            ) : (
              topicPassRates.map((row) => (
                <div key={`${row.topicId}-${row.difficulty}`} className="enlight-insights-row">
                  <div className="enlight-insights-row__main">
                    <span className="enlight-insights-row__title">{row.topicTitle}</span>
                    <span className="enlight-insights-row__subject">
                      {row.subjectName} · {row.chapterTitle} · {row.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="enlight-insights-row__stats">
                    <span>{row.passRate}% pass</span>
                    <span>
                      {row.passed}/{row.attempted} students
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">Site overview</h2>
          <div className="enlight-metric-grid">
            <MetricCard
              label="Registered profiles"
              value={loading ? '…' : String(siteTotals.totalUsers)}
              hint={`${siteTotals.syncedUsers} with study data`}
              accent="gold"
            />
            <MetricCard
              label="Total study time"
              value={loading ? '…' : formatDurationHours(siteTotals.totalStudySec)}
              hint="All topics + chapters"
              accent="mint"
            />
            <MetricCard
              label="Quiz attempts"
              value={loading ? '…' : String(siteTotals.totalQuizAttempts)}
              hint={`${siteTotals.totalQuizFails} failed attempts`}
            />
            <MetricCard
              label="Active students"
              value={loading ? '…' : `${siteTotals.active7d} / ${siteTotals.active30d}`}
              hint="Studied in last 7d · 30d"
            />
            <MetricCard
              label="Total XP earned"
              value={loading ? '…' : siteTotals.totalXp.toLocaleString()}
              hint="Across all accounts"
            />
            <MetricCard
              label="Platform sync"
              value={
                loading
                  ? '…'
                  : platform?.updatedAt
                    ? platform.updatedAt.toLocaleString()
                    : 'Not yet'
              }
              hint={`${(platform?.totalSignUps ?? 0).toLocaleString()} sign-ups tracked`}
            />
          </div>

          <AnalyticsBarChart
            title="Where study time goes (site-wide)"
            items={[
              { label: 'Topic lessons', value: studyBreakdown.topicStudySec },
              { label: 'Chapters & quizzes', value: studyBreakdown.chapterStudySec },
            ]}
            valueFormatter={(n) => formatDuration(n)}
            emptyMessage="No synced study time yet."
          />
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">
            Subjects needing attention
          </h2>
          <AnalyticsBarChart
            title="Struggle score by subject"
            items={subjectStruggle.map((row) => ({
              label: row.subjectName,
              value: Math.round(row.struggleScore),
              sublabel: `${row.totalTimeMin} min · ${row.failRate}% fail`,
            }))}
            valueFormatter={(n) => String(n)}
            emptyMessage="Subject rankings appear after students study and quiz."
          />
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">
            Worst chapter per subject
          </h2>
          <div className="enlight-admin-insight-grid">
            {worstBySubject.length === 0 ? (
              <p className="enlight-body-text">No chapter data yet.</p>
            ) : (
              worstBySubject.map((row) => (
                <div key={row.subjectId} className="enlight-admin-insight-card">
                  <span className="enlight-admin-insight-card__subject">{row.subjectName}</span>
                  <span className="enlight-admin-insight-card__title">{row.chapterTitle}</span>
                  <span className="enlight-admin-insight-card__meta">
                    {row.failRate}% fail · {row.timeSpentMin} min avg · {row.studentCount} students
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">
            Topics students spend most time on
          </h2>
          <AnalyticsBarChart
            title="Top topics by total study time"
            items={topicRanks.map((row) => ({
              label: row.topicTitle,
              value: row.totalTimeSec,
              sublabel: `${row.subjectName} · ${row.avgTimeMin} min avg · ${row.studentCount} students`,
            }))}
            valueFormatter={(n) => formatDuration(n)}
            emptyMessage="Topic rankings appear after students read lessons."
          />
        </section>

        <section className="enlight-analytics-section">
          <h2 className="enlight-heading-serif enlight-analytics-section__title">
            Toughest chapters (site-wide)
          </h2>
          <AnalyticsBarChart
            title="Highest difficulty score"
            items={chapterRanks.map((row) => ({
              label: row.chapterTitle,
              value: row.timeSpentMin * 2 + row.failRate + row.quizFails * 5,
              sublabel: `${row.subjectName} · ${row.failRate}% fail · ${row.studentCount} students`,
            }))}
            valueFormatter={(n) => String(Math.round(n))}
            emptyMessage="Chapter difficulty appears after quiz activity."
          />
        </section>
      </div>

      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
