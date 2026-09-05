```tsx
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// 캘린더는 브라우저에서만 실행
const Calendar = dynamic(
  () => import('./components/Calendar'),
  { ssr: false }
)

// 직원 명단
const EMPLOYEE_LIST = [
  '오호광', '김혜숙', '이철', '최병곤', '이혜권',
  '장래한', '이소연', '차지원', '김윤호', '김세미',
  '윤재민', '최경재', '최여린', '이재민', '홍영주',
  '정태진', '손지연', '오단비', '길남오', '김금표'
]

// 휴가 데이터의 형태
interface VacationEvent {
  id: string
  title: string
  start: string
  end: string
}

export default function VacationCalendar() {
  const [mounted, setMounted] = useState(false)

  // 휴가 데이터
  const [events, setEvents] = useState<VacationEvent[]>([])

  // 신청 폼
  const [selectedEmployee, setSelectedEmployee] = useState(EMPLOYEE_LIST[0])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [vacationType, setVacationType] = useState('휴가')

  // -----------------------------------------
  // 1. 사이트가 처음 열릴 때 저장된 휴가 불러오기
  // -----------------------------------------
  useEffect(() => {
    setMounted(true)

    const savedEvents = localStorage.getItem('vacationEvents')

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents)
        setEvents(parsedEvents)
      } catch (error) {
        console.error('저장된 휴가 데이터를 불러오지 못했습니다.', error)
        setEvents([])
      }
    } else {
      // 처음 사용하는 경우 기본 예시 데이터
      const defaultEvents: VacationEvent[] = [
        {
          id: 'default-1',
          title: '오호광 휴가',
          start: '2026-09-10',
          end: '2026-09-12'
        },
        {
          id: 'default-2',
          title: '김혜숙 연차',
          start: '2026-09-15',
          end: '2026-09-15'
        }
      ]

      setEvents(defaultEvents)
      localStorage.setItem(
        'vacationEvents',
        JSON.stringify(defaultEvents)
      )
    }
  }, [])

  // -----------------------------------------
  // 2. 휴가 데이터가 변경되면 자동 저장
  // -----------------------------------------
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem(
      'vacationEvents',
      JSON.stringify(events)
    )
  }, [events, mounted])

  // -----------------------------------------
  // 3. 휴가 등록
  // -----------------------------------------
  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault()

    // 시작일 검사
    if (!startDate) {
      alert('시작 날짜를 선택해주세요!')
      return
    }

    // 종료일을 입력하지 않으면 시작일과 같은 날
    const finalEndDate = endDate || startDate

    // 종료일이 시작일보다 빠른 경우
    if (finalEndDate < startDate) {
      alert('종료일은 시작일보다 빠를 수 없습니다!')
      return
    }

    // 새로운 휴가 만들기
    const newEvent: VacationEvent = {
      id: `${Date.now()}-${Math.random()}`,
      title: `${selectedEmployee} ${vacationType}`,
      start: startDate,
      end: finalEndDate
    }

    // 기존 휴가 + 새로운 휴가
    setEvents((currentEvents) => [
      ...currentEvents,
      newEvent
    ])

    alert(`${selectedEmployee}님의 ${vacationType}가 등록되었습니다!`)

    // 입력창 초기화
    setStartDate('')
    setEndDate('')
  }

  // -----------------------------------------
  // 4. 휴가 삭제
  // -----------------------------------------
  const handleDeleteVacation = (id: string) => {
    const vacation = events.find(
      (event) => event.id === id
    )

    if (!vacation) return

    const confirmDelete = window.confirm(
      `"${vacation.title}" 휴가를 삭제하시겠습니까?`
    )

    if (!confirmDelete) return

    setEvents((currentEvents) =>
      currentEvents.filter(
        (event) => event.id !== id
      )
    )

    alert('휴가가 삭제되었습니다.')
  }

  return (
    <main
      style={{
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'sans-serif'
      }}
    >
      {/* 제목 */}
      <h1
        style={{
          textAlign: 'center',
          color: '#1f2937'
        }}
      >
        🏥 검사실 직원 휴가 관리 캘린더
      </h1>

      <p
        style={{
          textAlign: 'center',
          color: '#4b5563',
          marginBottom: '30px'
        }}
      >
        모바일과 웹에서 본인의 휴가를 확인하고 신청하세요.
      </p>

      {/* --------------------------------------- */}
      {/* 휴가 신청 영역 */}
      {/* --------------------------------------- */}
      <div
        style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #e5e7eb'
        }}
      >
        <h3>📝 휴가 신청하기</h3>

        <form
          onSubmit={handleAddVacation}
          style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px, 1fr))',
            alignItems: 'end'
          }}
        >
          {/* 직원 이름 */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              직원 이름
            </label>

            <select
              value={selectedEmployee}
              onChange={(e) =>
                setSelectedEmployee(e.target.value)
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db'
              }}
            >
              {EMPLOYEE_LIST.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* 휴가 종류 */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              구분
            </label>

            <select
              value={vacationType}
              onChange={(e) =>
                setVacationType(e.target.value)
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db'
              }}
            >
              <option value="휴가">휴가</option>
              <option value="연차">연차</option>
              <option value="반차">반차</option>
            </select>
          </div>

          {/* 시작일 */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              시작일
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db'
              }}
            />
          </div>

          {/* 종료일 */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              종료일 (선택)
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db'
              }}
            />
          </div>

          {/* 등록 버튼 */}
          <div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '9px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              신청 등록하기
            </button>
          </div>
        </form>
      </div>

      {/* --------------------------------------- */}
      {/* 캘린더 */}
      {/* --------------------------------------- */}
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow:
            '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          marginBottom: '30px'
        }}
      >
        {mounted && (
          <Calendar events={events} />
        )}
      </div>

      {/* --------------------------------------- */}
      {/* 등록된 휴가 목록 */}
      {/* --------------------------------------- */}
      <div
        style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}
      >
        <h3>📋 등록된 휴가</h3>

        {events.length === 0 ? (
          <p style={{ color: '#6b7280' }}>
            등록된 휴가가 없습니다.
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {events.map((event) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div>
                  <strong>{event.title}</strong>

                  <div
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginTop: '3px'
                    }}
                  >
                    {event.start}
                    {event.end !== event.start &&
                      ` ~ ${event.end}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteVacation(event.id)
                  }
                  style={{
                    padding: '6px 10px',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 저장 안내 */}
      <p
        style={{
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '13px',
          marginTop: '20px'
        }}
      >
        💾 휴가 정보는 이 브라우저에 자동으로 저장됩니다.
      </p>
    </main>
  )
}
```
