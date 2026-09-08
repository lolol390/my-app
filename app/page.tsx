'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'

const Calendar = dynamic(() => import('./components/Calendar'), { ssr: false })

const EMPLOYEE_LIST = [
  '오호광', '김혜숙', '이철', '최병곤', '이혜권',
  '장래한', '이소연', '차지원', '김윤호', '김세미',
  '윤재민', '최경재', '최여린', '이재민', '홍영주',
  '정태진', '손지연', '오단비', '길남오', '김금표'
]

interface VacationEvent {
  id: string
  title: string
  start: string
  end: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export default function VacationCalendar() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState<VacationEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedEmployee, setSelectedEmployee] = useState(EMPLOYEE_LIST[0])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [vacationType, setVacationType] = useState('휴가')

  useEffect(() => {
    setMounted(true)
    loadVacations()
  }, [])

  async function loadVacations() {
    if (!supabase) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('vacations')
      .select('id, title, start, "end"')
      .order('start', { ascending: true })

    if (error) {
      console.error(error)
      alert(`휴가 정보를 불러오지 못했습니다.\n\n오류 내용: ${error.message}\n오류 코드: ${error.code ?? '없음'}`)
      setEvents([])
    } else {
      setEvents(data ?? [])
    }

    setLoading(false)
  }

  const handleAddVacation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      alert('Supabase 환경변수가 설정되지 않았습니다.')
      return
    }

    if (!startDate) {
      alert('시작 날짜를 선택해주세요!')
      return
    }

    const finalEndDate = endDate || startDate

    if (finalEndDate < startDate) {
      alert('종료일은 시작일보다 빠를 수 없습니다!')
      return
    }

    setSaving(true)

    const { data, error } = await supabase
      .from('vacations')
      .insert({
        title: `${selectedEmployee} ${vacationType}`,
        start: startDate,
        end: finalEndDate
      })
      .select('id, title, start, "end"')
      .single()

    setSaving(false)

    if (error) {
      console.error(error)
      alert(`휴가 저장에 실패했습니다.\n\n오류 내용: ${error.message}\n오류 코드: ${error.code ?? '없음'}`)
      return
    }

    setEvents((currentEvents) =>
      [...currentEvents, data].sort((a, b) => a.start.localeCompare(b.start))
    )

    alert(`${selectedEmployee}님의 ${vacationType}가 저장되었습니다!`)
    setStartDate('')
    setEndDate('')
  }

  const handleDeleteVacation = async (id: string) => {
    if (!supabase) return

    const vacation = events.find((event) => event.id === id)
    if (!vacation) return

    const confirmDelete = window.confirm(
      `"${vacation.title}" 휴가를 삭제하시겠습니까?`
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('vacations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('휴가 삭제에 실패했습니다.')
      return
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    )

    alert('휴가가 삭제되었습니다.')
  }

  return (
    <main style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#1f2937' }}>
        🏥 검사실 직원 휴가 관리 캘린더
      </h1>

      <p style={{
        textAlign: 'center',
        color: '#4b5563',
        marginBottom: '30px'
      }}>
        모바일과 웹에서 본인의 휴가를 확인하고 신청하세요.
      </p>

      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e5e7eb'
      }}>
        <h3>📝 휴가 신청하기</h3>

        <form onSubmit={handleAddVacation} style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              직원 이름
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              {EMPLOYEE_LIST.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              구분
            </label>
            <select
              value={vacationType}
              onChange={(e) => setVacationType(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="휴가">휴가</option>
              <option value="연차">연차</option>
              <option value="반차">반차</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              종료일 (선택)
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '9px',
                background: saving ? '#93c5fd' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: saving ? 'wait' : 'pointer'
              }}
            >
              {saving ? '저장 중...' : '신청 등록하기'}
            </button>
          </div>
        </form>
      </div>

      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
        marginBottom: '30px'
      }}>
        {mounted && (
          loading
            ? <p style={{ textAlign: 'center', color: '#6b7280' }}>휴가 정보를 불러오는 중...</p>
            : <Calendar events={events} />
        )}
      </div>

      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3>📋 등록된 휴가</h3>

        {loading ? (
          <p style={{ color: '#6b7280' }}>불러오는 중...</p>
        ) : events.length === 0 ? (
          <p style={{ color: '#6b7280' }}>등록된 휴가가 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {events.map((event) => (
              <div key={event.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div>
                  <strong>{event.title}</strong>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '3px' }}>
                    {event.start}
                    {event.end !== event.start && ` ~ ${event.end}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteVacation(event.id)}
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

      <p style={{
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '13px',
        marginTop: '20px'
      }}>
        💾 휴가 정보는 여러 사람이 함께 사용하는 온라인 데이터베이스에 저장됩니다.
      </p>
    </main>
  )
}
