export default function AdminPage() {
  return (
    <section className="rounded-3xl border border-line bg-white px-6 py-10 sm:px-10">
      <p className="text-xs tracking-[0.14em] text-gold">ADMIN</p>
      <h2 className="mt-2 text-2xl font-semibold">관리자 페이지</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        자산 마스터, 세율, 만기 알림 규칙을 다룰 관리 화면입니다. 이번 단계에서는 입장 경로만 연결해 두었습니다.
      </p>
      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["등록 자산", "10"],
          ["만기 임박", "2"],
          ["적용 세율", "단순 가정"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-paper px-4 py-4">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-2 text-lg font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
