'use client'

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  type EventProps,
} from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = { ko }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

const EMPLOYEE_LIST = [
  '오호광', '김혜숙', '이철', '최병곤', '이혜권',
  '장래한', '이소연', '차지원', '김윤호', '김세미',
  '윤재민', '최경재', '최여린', '이재민', '홍영주',
  '정태진', '손지연', '오단비', '길남오', '김금표',
]

// 직원 20명에게 각각 다른 색상을 고정으로 지정합니다.
const EMPLOYEE_COLORS: Record<string, string> = {
  '오호광': '#ef4444',
  '김혜숙': '#f97316',
  '이철': '#eab308',
  '최병곤': '#22c55e',
  '이혜권': '#14b8a6',
  '장래한': '#06b6d4',
  '이소연': '#3b82f6',
  '차지원': '#6366f1',
  '김윤호': '#8b5cf6',
  '김세미': '#a855f7',
  '윤재민': '#ec4899',
  '최경재': '#f43f5e',
  '최여린': '#fb7185',
  '이재민': '#84cc16',
  '홍영주': '#10b981',
  '정태진': '#0ea5e9',
  '손지연': '#2563eb',
  '오단비': '#7c3aed',
  '길남오': '#d946ef',
  '김금표': '#0891b2',
}

interface VacationEvent {
  id: string
  title: string
  start: string
  end?: string
}

interface CalendarProps {
  events: VacationEvent[]
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  isHoliday?: boolean
}

// 2026년 대한민국 주요 공휴일/대체공휴일입니다.
// 한국천문연구원 2026년 월력요항 기준입니다.
const HOLIDAYS = [
  ['2026-01-01', '신정'],
  ['2026-02-16', '설날 연휴'],
  ['2026-02-17', '설날'],
  ['2026-02-18', '설날 연휴'],
  ['2026-03-01', '삼일절'],
  ['2026-03-02', '삼일절 대체공휴일'],
  ['2026-05-01', '근로자의 날'],
  ['2026-05-05', '어린이날'],
  ['2026-05-24', '부처님오신날'],
  ['2026-05-25', '부처님오신날 대체공휴일'],
  ['2026-06-03', '전국동시지방선거'],
  ['2026-06-06', '현충일'],
  ['2026-08-15', '광복절'],
  ['2026-08-17', '광복절 대체공휴일'],
  ['2026-09-24', '추석 연휴'],
  ['2026-09-25', '추석'],
  ['2026-09-26', '추석 연휴'],
  ['2026-10-03', '개천절'],
  ['2026-10-05', '개천절 대체공휴일'],
  ['2026-10-09', '한글날'],
  ['2026-12-25', '성탄절'],
] as const

const holidayEvents: CalendarEvent[] = HOLIDAYS.map(([date, name], index) => ({
  id: `holiday-${index}`,
  title: `🇰🇷 ${name}`,
  start: new Date(`${date}T00:00:00`),
  end: new Date(`${date}T23:59:59`),
  isHoliday: true,
}))

function getEmployeeFromTitle(title: string) {
  return EMPLOYEE_LIST.find((name) => title.startsWith(name))
}

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

function isHolidayDate(date: Date) {
  const key = format(date, 'yyyy-MM-dd')
  return HOLIDAYS.some(([holidayDate]) => holidayDate === key)
}

function DateHeader({ date, label }: { date: Date; label: string }) {
  const weekend = isWeekend(date)
  const holiday = isHolidayDate(date)

  return (
    <span
      style={{
        color: weekend || holiday ? '#dc2626' : '#111827',
        fontWeight: holiday ? 800 : 600,
      }}
      title={holiday ? '공휴일' : undefined}
    >
      {label}
    </span>
  )
}

export default function Calendar({ events }: CalendarProps) {
  const vacationEvents: CalendarEvent[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(`${event.start}T00:00:00`),
    end: new Date(`${event.end || event.start}T23:59:59`),
  }))

  const allEvents = [...holidayEvents, ...vacationEvents]

  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.isHoliday) {
      return {
        style: {
          backgroundColor: '#fee2e2',
          borderColor: '#ef4444',
          color: '#b91c1c',
          fontWeight: 700,
        },
      }
    }

    const employee = getEmployeeFromTitle(event.title)
    const color = employee ? EMPLOYEE_COLORS[employee] : '#64748b'

    return {
      style: {
        backgroundColor: color,
        borderColor: color,
        color: '#ffffff',
        fontWeight: 600,
      },
    }
  }

  const dayPropGetter = (date: Date) => {
    const weekend = isWeekend(date)
    const holiday = isHolidayDate(date)

    return {
      style: {
        backgroundColor: holiday
          ? '#fff7f7'
          : weekend
            ? '#fffafa'
            : '#ffffff',
      },
    }
  }

  return (
    <div className="vacation-calendar">
      <BigCalendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '620px' }}
        eventPropGetter={eventStyleGetter as EventProps<CalendarEvent>['eventPropGetter']}
        dayPropGetter={dayPropGetter}
        components={{
          month: {
            dateHeader: DateHeader,
          },
        }}
        messages={{
          next: '다음',
          previous: '이전',
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
          agenda: '일정',
          date: '날짜',
          time: '시간',
          event: '일정',
          noEventsInRange: '이 기간에는 일정이 없습니다.',
        }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
      />

      <div className="employee-color-legend">
        <h3>👥 직원별 색상</h3>
        <div className="employee-color-grid">
          {EMPLOYEE_LIST.map((name, index) => (
            <div className="employee-color-item" key={name}>
              <span
                className="employee-color-dot"
                style={{ backgroundColor: EMPLOYEE_COLORS[name] }}
              />
              <span className="employee-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="holiday-list">
        <h3>🇰🇷 2026년 공휴일</h3>
        <div className="holiday-grid">
          {HOLIDAYS.map(([date, name]) => (
            <div key={date} className="holiday-item">
              <strong>{format(new Date(`${date}T00:00:00`), 'M월 d일')}</strong>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
