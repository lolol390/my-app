'use client'

import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// date-fns를 이용한 로컬라이저 설정 (인증서 에러 안 남!)
const locales = {
  'ko': ko,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

interface CalendarProps {
  events: Array<{ title: string; start: string; end?: string }>
}

export default function Calendar({ events }: CalendarProps) {
  const formattedEvents = events.map(event => ({
    title: event.title,
    start: new Date(event.start),
    end: event.end ? new Date(event.end) : new Date(event.start),
  }));

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={{
          next: "다음",
          previous: "이전",
          today: "오늘",
          month: "월",
          week: "주",
          day: "일",
        }}
      />
    </div>
  )
}