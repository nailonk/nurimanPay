function StatusBadge({ status = "" }) {
  const styles = {
    berhasil: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    gagal: "bg-red-100 text-red-600",
  }

  const label = (status || "pending").toLowerCase()

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[label] || styles.pending}`}>
      {label}
    </span>
  )
}

export default StatusBadge