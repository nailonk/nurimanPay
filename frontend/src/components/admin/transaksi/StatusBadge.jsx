function StatusBadge({ status = "" }) {
  const styles = {
    berhasil: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    gagal: "bg-red-50 text-red-600 border-red-100",
  }

  const label = (status || "pending").toLowerCase()

  return (
    <div className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border text-[11px] font-bold capitalize ${styles[label]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${label === 'berhasil' ? 'bg-green-500' : label === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`} />
      {label}
    </div>
  )
}

export default StatusBadge