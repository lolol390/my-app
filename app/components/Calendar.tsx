'use client'

import {
  Calendar as BigCalendar,
  dateFnsLocalizer
} from 'react-big-calendar'

import {
  format,
  parse,
  startOfWeek,
  getDay
} from 'date-fns'

import { ko } from 'date-fns/locale'

import 'react-big-calendar/lib/css/react-big-calendar.css'

// 한국어 설정
const locales = {
  ko: ko
}

// 날짜 표시 설정
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () =>
    startOfWeek(new Date(), {
      weekStartsOn: 0
    }),
  getDay,
  locales
})

// 휴가 데이터 형태
interface VacationEvent {
  id: string
  title: string
  start: string
  end?: string
}

interface CalendarProps {
  events: VacationEvent[]
}

export default function Calendar({
  events
}: CalendarProps) {

  // 문자열 날짜 → 달력이 이해할 수 있는 Date로 변환
  const formattedEvents = events.map((event) => ({
    id: event.id,

    title: event.title,

    start: new Date(event.start + 'T00:00:00'),

    end: new Date((event.end || event.start) + 'T23:59:59')
  }))

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: '100%'
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
          noEventsInRange:
            '이 기간에는 일정이 없습니다.'
        }}
        views={[
          'month',
          'week',
          'day',
          'agenda'
        ]}
        defaultView="month"
      />
    </div>
  )
}
