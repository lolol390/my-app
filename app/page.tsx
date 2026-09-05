"use client";

import { useState } from "react";

const employees = [
"오호광", "김혜숙", "이철", "최병곤", "이혜권",
"장래한", "이소연", "차지원", "김윤호", "김세미",
"윤재민", "최경재", "최여린", "이재민", "홍영주",
"정태진", "손지연", "오단비", "길남오", "김금표"
];

const vacationTypes = [
"연차",
"반차 (오전)",
"반차 (오후)",
"외출",
"대체휴가",
"감정노동휴가",
"온라인대체교육휴가"
];

type Vacation = {
id: number;
employee: string;
type: string;
start: string;
end: string;
};

export default function Home() {
const today = new Date();

const [currentDate, setCurrentDate] = useState(
new Date(today.getFullYear(), today.getMonth(), 1)
);

const [vacations, setVacations] = useState<Vacation[]>([]);
const [modalOpen, setModalOpen] = useState(false);

const [employee, setEmployee] = useState(employees[0]);
const [vacationType, setVacationType] = useState(vacationTypes[0]);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const year = currentDate.getFullYear();
const month = currentDate.getMonth();

const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

const days: (number | null)[] = [];

for (let i = 0; i < firstDay; i++) {
days.push(null);
}

for (let i = 1; i <= daysInMonth; i++) {
days.push(i);
}

const getVacations = (day: number) => {
const date = new Date(year, month, day);

return vacations.filter((vacation) => {
  const start = new Date(`${vacation.start}T00:00:00`);
  const end = new Date(`${vacation.end}T23:59:59`);

  return date >= start && date <= end;
});


};

const addVacation = () => {
if (!employee || !vacationType || !startDate || !endDate) {
alert("직원, 휴가 종류, 날짜를 모두 선택해주세요.");
return;
}

if (startDate > endDate) {
  alert("종료일이 시작일보다 빠를 수 없습니다.");
  return;
}

const newVacation: Vacation = {
  id: Date.now(),
  employee,
  type: vacationType,
  start: startDate,
  end: endDate
};

setVacations((old) => [...old, newVacation]);

setModalOpen(false);
setStartDate("");
setEndDate("");
setVacationType(vacationTypes[0]);


};

const deleteVacation = (id: number) => {
if (confirm("이 휴가를 삭제할까요?")) {
setVacations((old) =>
old.filter((vacation) => vacation.id !== id)
);
}
};

return (
<main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
<div className="mx-auto max-w-7xl">

    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          검사실 직원 관리
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          검사실 직원 휴가 달력
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          직원들의 휴가 일정을 한눈에 확인하세요.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
      >
        + 휴가 등록
      </button>
    </header>

    <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex justify-between">
        <h2 className="font-semibold">
          검사실 직원
        </h2>

        <span className="text-sm text-slate-400">
          총 {employees.length}명
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {employees.map((name) => (
          <span
            key={name}
            className="rounded-full bg-blue-100 px-3 py-1.5 text-sm text-blue-800"
          >
            {name}
          </span>
        ))}
      </div>
    </section>

    <section className="overflow-hidden rounded-xl bg-white shadow-sm">

      <div className="flex items-center justify-between border-b p-4">

        <button
          type="button"
          onClick={() =>
            setCurrentDate(
              new Date(year, month - 1, 1)
            )
          }
          className="rounded-lg border px-4 py-2 hover:bg-slate-100"
        >
          ←
        </button>

        <h2 className="text-xl font-bold">
          {year}년 {month + 1}월
        </h2>

        <button
          type="button"
          onClick={() =>
            setCurrentDate(
              new Date(year, month + 1, 1)
            )
          }
          className="rounded-lg border px-4 py-2 hover:bg-slate-100"
        >
          →
        </button>

      </div>

      <div className="grid grid-cols-7 bg-slate-100">
        {["일", "월", "화", "수", "목", "금", "토"].map(
          (day) => (
            <div
              key={day}
              className="border p-3 text-center text-sm font-semibold"
            >
              {day}
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <div
            key={index}
            className="min-h-32 border p-2"
          >
            {day && (
              <>
                <div className="mb-2 text-sm font-semibold">
                  {day}
                </div>

                <div className="space-y-1">
                  {getVacations(day).map((vacation) => (
                    <button
                      key={vacation.id}
                      type="button"
                      onClick={() =>
                        deleteVacation(vacation.id)
                      }
                      className="block w-full truncate rounded bg-blue-100 px-2 py-1 text-left text-xs text-blue-800 hover:bg-blue-200"
                    >
                      <span className="font-bold">
                        {vacation.employee}
                      </span>
                      <br />
                      {vacation.type}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </section>

    {modalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              휴가 등록
            </h2>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="text-2xl text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="mt-6 space-y-4">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                직원
              </label>

              <select
                value={employee}
                onChange={(e) =>
                  setEmployee(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                {employees.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                휴가 종류
              </label>

              <select
                value={vacationType}
                onChange={(e) =>
                  setVacationType(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                {vacationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                시작일
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                종료일
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

          </div>

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-lg border px-4 py-3 font-semibold hover:bg-gray-100"
            >
              취소
            </button>

            <button
              type="button"
              onClick={addVacation}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
              저장
            </button>

          </div>

        </div>
      </div>
    )}

  </div>
</main>


);
}