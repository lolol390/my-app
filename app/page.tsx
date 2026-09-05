'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// [중요] page.tsx에서는 FullCalendar를 직접 쓰지 않고, components/Calendar.tsx를 불러옵니다!
const Calendar = dynamic(
  () => import('./components/Calendar'),
  { ssr: false }
)

// 20명 직원 명단
const EMPLOYEE_LIST = [
  '오호광', '김혜숙', '이철', '최병곤', '이혜권', 
  '장래한', '이소연', '차지원', '김윤호', '김세미', 
  '윤재민', '최경재', '최여린', '이재민', '홍영주', 
  '정태진', '손지연', '오단비', '길남오', '김금표'
];

export default function VacationCalendar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [events, setEvents] = useState([
    { title: '오호광 휴가', start: '2026-09-10', end: '2026-09-12' },
    { title: '김혜숙 연차', start: '2026-09-15' }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(EMPLOYEE_LIST[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState('휴가');

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      alert('시작 날짜를 선택해주세요!');
      return;
    }

    const newEvent = {
      title: `${selectedEmployee} ${vacationType}`,
      start: startDate,
      end: endDate ? endDate : startDate,
    };

    setEvents([...events, newEvent]);
    alert(`${selectedEmployee}님의 휴가가 등록되었습니다!`);
    
    setStartDate('');
    setEndDate('');
  };

  return (
    <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1f2937' }}>🏥 검사실 직원 휴가 관리 캘린더</h1>
      <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '30px' }}>모바일과 웹에서 본인의 휴가를 확인하고 신청하세요.</p>
      
      {/* 휴가 신청 폼 박스 */}
      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e5e7eb' }}>
        <h3>📝 휴가 신청하기</h3>
        <form onSubmit={handleAddVacation} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignItems: 'end' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>직원 이름</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>구분</label>
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>시작일</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>종료일 (선택)</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <button 
              type="submit"
              style={{ width: '100%', padding: '9px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              신청 등록하기
            </button>
          </div>
        </form>
      </div>

      {/* 캘린더 영역 (Calendar 컴포넌트 호출) */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        {mounted && <Calendar events={events} />}
      </div>
    </main>
  );
}